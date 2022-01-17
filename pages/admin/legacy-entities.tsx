import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import DeletionModal from '@app/organisms/DeletionModal'
import queries from '@app/queries'
import { Button, Card, Table, TextInput } from '@singularity/core'
import MaterialDeleteOutlined from '@singularity/core/icons/material/MaterialDeleteOutlined'
import MaterialEditOutlined from '@singularity/core/icons/material/MaterialEditOutlined'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useRef, useState } from 'react'

import type { LegacyEntity } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    isSortable: true,
    key: 'name',
    label: 'Nom court',
  },
  {
    isSortable: true,
    key: 'fullName',
    label: 'Nom complet',
  },
]

export default function AdminLegacyEntityListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteLegacyEntity] = useMutation(queries.legacyEntity.DELETE_ONE)
  const getLegacyEntitiesResult = useQuery(queries.legacyEntity.GET_ALL, {
    pollInterval: 1000,
  })
  const router = useRouter()

  const isLoading = getLegacyEntitiesResult.loading
  const legacyEntities =
    isLoading || getLegacyEntitiesResult.error ? [] : getLegacyEntitiesResult.data.getLegacyEntities

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmDeletion = async (id: string) => {
    const legacyEntity = R.find<LegacyEntity>(R.propEq('id', id))(legacyEntities)
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

  const search = debounce(async () => {
    if ($searchInput.current === null) {
      return
    }

    const query = $searchInput.current.value

    getLegacyEntitiesResult.refetch({
      query,
    })
  }, 250)

  const columns: TableColumnProps[] = [
    ...BASE_COLUMNS,
    {
      accent: 'primary',
      action: goToEditor,
      Icon: MaterialEditOutlined,
      label: 'Éditer cette entité',
      type: 'action',
    },
    {
      accent: 'danger',
      action: confirmDeletion,
      Icon: MaterialDeleteOutlined,
      label: 'Supprimer cette entité',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <Title>Entités (Legacy)</Title>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter une entité
        </Button>
      </AdminHeader>

      <Card>
        <TextInput ref={$searchInput} onInput={search} placeholder="Rechercher une entité (legacy)" />

        <Table columns={columns} data={legacyEntities} defaultSortedKey="name" isLoading={isLoading} />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
