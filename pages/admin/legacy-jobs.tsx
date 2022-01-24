import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import normalizeDate from '@app/helpers/normalizeDate'
import DeletionModal from '@app/organisms/DeletionModal'
import queries from '@app/queries'
import { JOB_STATE_LABEL } from '@common/constants'
import { Button, Card, Table, TextInput } from '@singularity/core'
import MaterialDeleteOutlined from '@singularity/core/icons/material/MaterialDeleteOutlined'
import MaterialEditOutlined from '@singularity/core/icons/material/MaterialEditOutlined'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useRef, useState } from 'react'

import type { LegacyJob } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    key: 'source',
    label: 'Source',
    type: 'id',
  },
  {
    isSortable: true,
    key: 'title',
    label: 'Intitulé',
  },
  {
    isSortable: true,
    key: 'state',
    label: 'État',
    transform: ({ state }) => JOB_STATE_LABEL[state],
  },
  {
    isSortable: true,
    key: 'updatedAt',
    label: 'Mise à jour',
    transform: ({ updatedAt }) => normalizeDate(updatedAt),
  },
]

export default function AdminLegacyJobListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteLegacyJob] = useMutation(queries.legacyJob.DELETE_ONE)
  const router = useRouter()

  const getLegacyJobsResult = useQuery(queries.legacyJob.GET_ALL, {
    pollInterval: 1000,
  })

  const isLoading = getLegacyJobsResult.loading
  const legacyJobs = isLoading || getLegacyJobsResult.error ? [] : getLegacyJobsResult.data.getLegacyJobs

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmDeletion = async (id: string) => {
    const legacyJob = R.find<LegacyJob>(R.propEq('id', id))(legacyJobs)
    if (legacyJob === undefined) {
      return
    }

    setSelectedId(id)
    setSelectedEntity(String(legacyJob.title))
    setHasDeletionModal(true)
  }

  const deleteAndReload = async () => {
    setHasDeletionModal(false)

    await deleteLegacyJob({
      variables: {
        id: selectedId,
      },
    })
  }

  const goToEditor = (id: string) => {
    router.push(`/admin/legacy-job/${id}`)
  }

  const search = debounce(async () => {
    if ($searchInput.current === null) {
      return
    }

    const query = $searchInput.current.value

    getLegacyJobsResult.refetch({
      query,
    })
  }, 250)

  const columns: TableColumnProps[] = [
    ...BASE_COLUMNS,
    {
      accent: 'primary',
      action: goToEditor,
      Icon: MaterialEditOutlined,
      label: 'Éditer cette offre',
      type: 'action',
    },
    {
      accent: 'danger',
      action: confirmDeletion,
      Icon: MaterialDeleteOutlined,
      label: 'Supprimer cette offre',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <Title>Offres (Legacy)</Title>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter une offre
        </Button>
      </AdminHeader>

      <Card>
        <TextInput ref={$searchInput} onInput={search} placeholder="Rechercher une offre (legacy)" />

        <Table
          columns={columns}
          data={legacyJobs}
          defaultSortedKey="updatedAt"
          defaultSortedKeyIsDesc
          isLoading={isLoading}
        />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
