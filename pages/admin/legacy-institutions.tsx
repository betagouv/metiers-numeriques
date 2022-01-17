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

import type { LegacyInstitution } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    isSortable: true,
    key: 'title',
    label: 'Nom court',
  },
  {
    isSortable: true,
    key: 'fullName',
    label: 'Nom complet',
  },
]

export default function AdminLegacyInstitutionListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteLegacyInstitution] = useMutation(queries.legacyInstitution.DELETE_ONE)
  const getLegacyInstitutionsResult = useQuery(queries.legacyInstitution.GET_ALL, {
    pollInterval: 1000,
  })
  const router = useRouter()

  const isLoading = getLegacyInstitutionsResult.loading
  const legacyInstitutions =
    isLoading || getLegacyInstitutionsResult.error ? [] : getLegacyInstitutionsResult.data.getLegacyInstitutions

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmDeletion = async (id: string) => {
    const legacyInstitution = R.find<LegacyInstitution>(R.propEq('id', id))(legacyInstitutions)
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

  const search = debounce(async () => {
    if ($searchInput.current === null) {
      return
    }

    const query = $searchInput.current.value

    getLegacyInstitutionsResult.refetch({
      query,
    })
  }, 250)

  const columns: TableColumnProps[] = [
    ...BASE_COLUMNS,
    {
      accent: 'primary',
      action: goToEditor,
      Icon: MaterialEditOutlined,
      label: 'Éditer cette institution',
      type: 'action',
    },
    {
      accent: 'danger',
      action: confirmDeletion,
      Icon: MaterialDeleteOutlined,
      label: 'Supprimer cette institution',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <Title>Institutions (Legacy)</Title>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter une institution
        </Button>
      </AdminHeader>

      <Card>
        <TextInput ref={$searchInput} onInput={search} placeholder="Rechercher une institution (legacy)" />

        <Table columns={columns} data={legacyInstitutions} defaultSortedKey="title" isLoading={isLoading} />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
