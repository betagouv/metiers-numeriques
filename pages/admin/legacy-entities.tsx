import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import { DeletionModal } from '@app/organisms/DeletionModal'
import queries from '@app/queries'
import { define } from '@common/helpers/define'
import { Button, Card, Table, TextInput } from '@singularity/core'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useRef, useState } from 'react'
import { Edit, Trash } from 'react-feather'

import type { GetAllResponse } from '@api/resolvers/types'
import type { LegacyEntity } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    key: 'name',
    label: 'Nom court',
  },
  {
    key: 'fullName',
    label: 'Nom complet',
  },
]

const PER_PAGE = 10

export default function AdminLegacyEntityListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteLegacyEntity] = useMutation(queries.legacyEntity.DELETE_ONE)
  const router = useRouter()

  const getLegacyEntitiesResult = useQuery<
    {
      getLegacyEntities: GetAllResponse<LegacyEntity>
    },
    any
  >(queries.legacyEntity.GET_ALL, {
    pollInterval: 500,
    variables: {
      pageIndex: 0,
      perPage: PER_PAGE,
    },
  })

  const isLoading = getLegacyEntitiesResult.loading
  const legacyEntitiesResult: GetAllResponse<LegacyEntity> =
    isLoading || getLegacyEntitiesResult.error || getLegacyEntitiesResult.data === undefined
      ? {
          count: 1,
          data: [],
          index: 0,
          length: 0,
        }
      : getLegacyEntitiesResult.data.getLegacyEntities

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmDeletion = async (id: string) => {
    const legacyEntity = R.find<LegacyEntity>(R.propEq('id', id))(legacyEntitiesResult.data)
    if (legacyEntity === undefined) {
      return
    }

    setSelectedId(id)
    setSelectedEntity(`${legacyEntity.name} (${legacyEntity.fullName})`)
    setHasDeletionModal(true)
  }

  const deleteAndReload = async () => {
    setHasDeletionModal(false)

    await deleteLegacyEntity({
      variables: {
        id: selectedId,
      },
    })
  }

  const goToEditor = (id: string) => {
    router.push(`/admin/legacy-entity/${id}`)
  }

  const query = debounce(async (pageIndex: number) => {
    if ($searchInput.current === null) {
      return
    }

    const query = define($searchInput.current.value)

    getLegacyEntitiesResult.refetch({
      pageIndex,
      perPage: PER_PAGE,
      query,
    })
  }, 250)

  const columns: TableColumnProps[] = [
    ...BASE_COLUMNS,
    {
      accent: 'primary',
      action: goToEditor,
      Icon: Edit,
      label: 'Éditer cette entité [LEGACY]',
      type: 'action',
    },
    {
      accent: 'danger',
      action: confirmDeletion,
      Icon: Trash,
      label: 'Supprimer cette entité [LEGACY]',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <Title>Entités [LEGACY]</Title>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter une entité [LEGACY]
        </Button>
      </AdminHeader>

      <Card>
        <TextInput ref={$searchInput} onInput={() => query(0)} placeholder="Rechercher une entité [LEGACY]" />

        <Table
          columns={columns}
          data={legacyEntitiesResult.data}
          defaultSortedKey="updatedAt"
          defaultSortedKeyIsDesc
          isLoading={isLoading}
          onPageChange={query as any}
          pageCount={legacyEntitiesResult.count}
          pageIndex={legacyEntitiesResult.index}
          perPage={PER_PAGE}
        />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
