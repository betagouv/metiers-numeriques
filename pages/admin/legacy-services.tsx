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

import type { LegacyService } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    key: 'name',
    label: 'Nom court',
  },
  {
    key: 'fullName',
    label: 'Nom long',
  },
  {
    key: 'legacyEntity.name',
    label: 'Entité (legacy)',
  },
]

export default function AdminLegacyJobListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteLegacyService] = useMutation(queries.legacyService.DELETE_ONE)
  const getLegacyServicesResult = useQuery(queries.legacyService.GET_ALL, {
    pollInterval: 1000,
  })
  const router = useRouter()

  const isLoading = getLegacyServicesResult.loading
  const legacyJobs = isLoading || getLegacyServicesResult.error ? [] : getLegacyServicesResult.data.getLegacyServices

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmDeletion = async (id: string) => {
    const legacyService = R.find<LegacyService>(R.propEq('id', id))(legacyJobs)
    if (legacyService === undefined) {
      return
    }

    setSelectedId(id)
    setSelectedEntity(legacyService.id)
    setHasDeletionModal(true)
  }

  const deleteAndReload = async () => {
    setHasDeletionModal(false)

    await deleteLegacyService({
      variables: {
        id: selectedId,
      },
    })
  }

  const goToEditor = (id: string) => {
    router.push(`/admin/legacy-service/${id}`)
  }

  const search = debounce(async () => {
    if ($searchInput.current === null) {
      return
    }

    const query = $searchInput.current.value

    getLegacyServicesResult.refetch({
      query,
    })
  }, 250)

  const columns: TableColumnProps[] = [
    ...BASE_COLUMNS,
    {
      accent: 'primary',
      action: goToEditor,
      Icon: MaterialEditOutlined,
      label: 'Éditer ce service',
      type: 'action',
    },
    {
      accent: 'danger',
      action: confirmDeletion,
      Icon: MaterialDeleteOutlined,
      label: 'Supprimer ce service',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <Title>Services (Legacy)</Title>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter un service
        </Button>
      </AdminHeader>

      <Card>
        <TextInput ref={$searchInput} onInput={search} placeholder="Rechercher un service (legacy)" />

        <Table columns={columns} data={legacyJobs} defaultSortedKey="name" isLoading={isLoading} />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
