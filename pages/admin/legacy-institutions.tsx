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
import type { LegacyInstitution } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    key: 'title',
    label: 'Nom court',
  },
  {
    key: 'fullName',
    label: 'Nom complet',
  },
]

const PER_PAGE = 10

export default function AdminLegacyInstitutionListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteLegacyInstitution] = useMutation(queries.legacyInstitution.DELETE_ONE)
  const router = useRouter()

  const getLegacyInstitutionsResult = useQuery<
    {
      getLegacyInstitutions: GetAllResponse<LegacyInstitution>
    },
    any
  >(queries.legacyInstitution.GET_ALL, {
    nextFetchPolicy: 'no-cache',
    pollInterval: 500,
    variables: {
      pageIndex: 0,
      perPage: PER_PAGE,
    },
  })

  const isLoading = getLegacyInstitutionsResult.loading
  const legacyInsititutionResult: GetAllResponse<LegacyInstitution> =
    isLoading || getLegacyInstitutionsResult.error || getLegacyInstitutionsResult.data === undefined
      ? {
          count: 1,
          data: [],
          index: 0,
          length: 0,
        }
      : getLegacyInstitutionsResult.data.getLegacyInstitutions

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmDeletion = async (id: string) => {
    const legacyInstitution = R.find<LegacyInstitution>(R.propEq('id', id))(legacyInsititutionResult.data)
    if (legacyInstitution === undefined) {
      return
    }

    setSelectedId(id)
    setSelectedEntity(`${legacyInstitution.title} (${legacyInstitution.fullName})`)
    setHasDeletionModal(true)
  }

  const deleteAndReload = async () => {
    setHasDeletionModal(false)

    await deleteLegacyInstitution({
      variables: {
        id: selectedId,
      },
    })
  }

  const goToEditor = (id: string) => {
    router.push(`/admin/legacy-institution/${id}`)
  }

  const query = debounce(async (pageIndex: number) => {
    if ($searchInput.current === null) {
      return
    }

    const query = define($searchInput.current.value)

    getLegacyInstitutionsResult.refetch({
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
      key: 'edit',
      label: 'Éditer cette institution [LEGACY]',
      type: 'action',
    },
    {
      accent: 'danger',
      action: confirmDeletion,
      Icon: Trash,
      key: 'delete',
      label: 'Supprimer cette institution [LEGACY]',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <Title>Institutions [LEGACY]</Title>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter une institution [LEGACY]
        </Button>
      </AdminHeader>

      <Card>
        <TextInput ref={$searchInput} onInput={() => query(0)} placeholder="Rechercher une institution [LEGACY]" />

        <Table
          columns={columns}
          data={legacyInsititutionResult.data}
          isLoading={isLoading}
          onPageChange={query as any}
          pageCount={legacyInsititutionResult.count}
          pageIndex={legacyInsititutionResult.index}
          perPage={PER_PAGE}
        />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
