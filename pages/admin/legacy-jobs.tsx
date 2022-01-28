import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import { Flex } from '@app/atoms/Flex'
import Title from '@app/atoms/Title'
import { normalizeDate } from '@app/helpers/normalizeDate'
import { DeletionModal } from '@app/organisms/DeletionModal'
import queries from '@app/queries'
import { JOB_SOURCE_LABEL, JOB_STATE_LABEL } from '@common/constants'
import { define } from '@common/helpers/define'
import { Button, Card, Select, Table, TextInput } from '@singularity/core'
import MaterialDeleteOutlined from '@singularity/core/icons/material/MaterialDeleteOutlined'
import MaterialEditOutlined from '@singularity/core/icons/material/MaterialEditOutlined'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useRef, useState } from 'react'

import type { GetAllResponse } from '@api/resolvers/types'
import type { LegacyJob } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    grow: 0.1,
    key: 'source',
    label: 'Source',
    transform: ({ source }) => JOB_SOURCE_LABEL[source],
  },
  {
    key: 'title',
    label: 'Intitulé',
  },
  {
    grow: 0.1,
    key: 'state',
    label: 'État',
    transform: ({ state }) => JOB_STATE_LABEL[state],
  },
  {
    grow: 0.15,
    key: 'updatedAt',
    label: 'MàJ le',
    transform: ({ updatedAt }) => normalizeDate(updatedAt),
  },
]

const JOB_SOURCES_AS_OPTIONS = R.pipe(
  R.toPairs,
  R.map(([value, label]) => ({
    label,
    value,
  })),
)(JOB_SOURCE_LABEL)

const JOB_STATES_AS_OPTIONS = R.pipe(
  R.toPairs,
  R.map(([value, label]) => ({
    label,
    value,
  })),
)(JOB_STATE_LABEL)

const PER_PAGE = 10

export default function AdminLegacyJobListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const $source = useRef('')
  const $state = useRef('')
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteLegacyJob] = useMutation(queries.legacyJob.DELETE_ONE)
  const router = useRouter()

  const getLegacyJobsResult = useQuery<
    {
      getLegacyJobs: GetAllResponse<LegacyJob>
    },
    any
  >(queries.legacyJob.GET_ALL, {
    pollInterval: 500,
    variables: {
      pageIndex: 0,
      perPage: PER_PAGE,
    },
  })

  const isLoading = getLegacyJobsResult.loading
  const legacyJobsResult: GetAllResponse<LegacyJob> =
    isLoading || getLegacyJobsResult.error || getLegacyJobsResult.data === undefined
      ? {
          count: 1,
          data: [],
          index: 0,
          length: 0,
        }
      : getLegacyJobsResult.data.getLegacyJobs

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmDeletion = async (id: string) => {
    const legacyJob = R.find<LegacyJob>(R.propEq('id', id))(legacyJobsResult.data)
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

  const query = useCallback(
    debounce(async (pageIndex: number) => {
      if ($searchInput.current === null) {
        return
      }

      const query = define($searchInput.current.value)
      const source = define($source.current)
      const state = define($state.current)

      await getLegacyJobsResult.refetch({
        pageIndex,
        perPage: PER_PAGE,
        query,
        source,
        state,
      })
    }, 250),
    [],
  )

  const handleSourceSelect = option => {
    $source.current = option.value

    query(0)
  }

  const handleStateSelect = option => {
    $state.current = option.value

    query(0)
  }

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
        <Title>Offres Legacy</Title>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter une offre legacy
        </Button>
      </AdminHeader>

      <Card>
        <Flex>
          <TextInput ref={$searchInput} onInput={() => query(0)} placeholder="Rechercher une offre legacy" />
          <Select onChange={handleStateSelect} options={JOB_STATES_AS_OPTIONS} placeholder="État" />
          <Select onChange={handleSourceSelect} options={JOB_SOURCES_AS_OPTIONS} placeholder="Source" />
        </Flex>

        <Table
          columns={columns}
          data={legacyJobsResult.data}
          defaultSortedKey="updatedAt"
          defaultSortedKeyIsDesc
          isLoading={isLoading}
          onPageChange={query as any}
          pageCount={legacyJobsResult.count}
          pageIndex={legacyJobsResult.index}
          perPage={PER_PAGE}
        />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
