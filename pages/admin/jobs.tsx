import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import { Flex } from '@app/atoms/Flex'
import Title from '@app/atoms/Title'
import { humanizeDate } from '@app/helpers/humanizeDate'
import { showApolloError } from '@app/helpers/showApolloError'
import { DeletionModal } from '@app/organisms/DeletionModal'
import queries from '@app/queries'
import { JOB_SOURCES_AS_OPTIONS, JOB_STATES_AS_OPTIONS, JOB_STATE_LABEL } from '@common/constants'
import { define } from '@common/helpers/define'
import { Job, UserRole } from '@prisma/client'
import { Button, Card, Select, Table, TextInput } from '@singularity/core'
import debounce from 'lodash.debounce'
import { useAuth } from 'nexauth/client'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Edit, ExternalLink, Trash } from 'react-feather'

import type { GetAllResponse } from '@api/resolvers/types'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
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
    key: 'expiredAt',
    label: 'Expire le',
    transform: ({ expiredAt }) => humanizeDate(expiredAt),
  },
  {
    grow: 0.15,
    key: 'updatedAt',
    label: 'MàJ le',
    transform: ({ updatedAt }) => humanizeDate(updatedAt),
  },
]

const PER_PAGE = 10

export default function AdminJobListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const $source = useRef('')
  const $state = useRef('')
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const auth = useAuth<Common.Auth.User>()
  const [deleteJob] = useMutation(queries.job.DELETE_ONE)
  const router = useRouter()

  const getJobsResult = useQuery<
    {
      getJobs: GetAllResponse<Job>
    },
    any
  >(queries.job.GET_ALL, {
    nextFetchPolicy: 'no-cache',
    pollInterval: 500,
    variables: {
      pageIndex: 0,
      perPage: PER_PAGE,
    },
  })

  const isLoading = getJobsResult.loading
  const jobsResult: GetAllResponse<Job> =
    isLoading || getJobsResult.error || getJobsResult.data === undefined
      ? {
          count: 1,
          data: [],
          index: 0,
          length: 0,
        }
      : getJobsResult.data.getJobs

  const closeDeletionModal = useCallback(() => {
    setHasDeletionModal(false)
  }, [])

  const confirmDeletion = useCallback(
    async (id: string) => {
      const job = R.find<Job>(R.propEq('id', id))(jobsResult.data)
      if (job === undefined) {
        return
      }

      setSelectedId(id)
      setSelectedEntity(job.title)
      setHasDeletionModal(true)
    },
    [jobsResult.data],
  )

  const deleteAndReload = useCallback(async () => {
    setHasDeletionModal(false)

    await deleteJob({
      variables: {
        id: selectedId,
      },
    })
  }, [selectedId])

  const goToEditor = useCallback((id: string) => {
    router.push(`/admin/job/${id}`)
  }, [])

  const goToPreview = useCallback(
    (id: string) => {
      const job = R.find<Job>(R.propEq('id', id))(jobsResult.data)
      if (job === undefined) {
        return
      }

      window.open(`/emploi/${job.slug}`)
    },
    [jobsResult.data],
  )

  const handleSourceSelect = useCallback((option: Common.App.SelectOption | null): void => {
    $source.current = option !== null ? option.value : ''

    query(0)
  }, [])

  const handleStateSelect = useCallback((option: Common.App.SelectOption | null): void => {
    $state.current = option !== null ? option.value : ''

    query(0)
  }, [])

  const query = useCallback(
    debounce(async (pageIndex: number) => {
      if ($searchInput.current === null) {
        return
      }

      const query = define($searchInput.current.value)
      const state = define($state.current)
      const source = define($source.current)

      await getJobsResult.refetch({
        pageIndex,
        perPage: PER_PAGE,
        query,
        source,
        state,
      })
    }, 250),
    [],
  )

  useEffect(() => {
    if (getJobsResult.error === undefined) {
      return
    }

    showApolloError(getJobsResult.error)
  }, [getJobsResult.error])

  const columns: TableColumnProps[] = useMemo(() => {
    const dynamicColumns: TableColumnProps[] = [
      ...BASE_COLUMNS,
      {
        accent: 'secondary',
        action: goToPreview,
        Icon: ExternalLink,
        label: 'Prévisualiser cette offre',
        type: 'action',
      },
      {
        accent: 'primary',
        action: goToEditor,
        Icon: Edit,
        label: 'Éditer cette offre',
        type: 'action',
      },
    ]

    if (auth.user?.role === UserRole.ADMINISTRATOR) {
      dynamicColumns.push({
        accent: 'danger',
        action: confirmDeletion,
        Icon: Trash,
        label: 'Supprimer cette offre',
        type: 'action',
      })
    }

    return dynamicColumns
  }, [jobsResult.data])

  return (
    <>
      <AdminHeader>
        <Title>Offres d’emploi</Title>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter une offre d’emploi
        </Button>
      </AdminHeader>

      <Card>
        <Flex>
          <TextInput ref={$searchInput} onInput={() => query(0)} placeholder="Rechercher une offre d’emploi" />
          <Select isClearable onChange={handleSourceSelect} options={JOB_SOURCES_AS_OPTIONS} placeholder="Source" />
          <Select isClearable onChange={handleStateSelect} options={JOB_STATES_AS_OPTIONS} placeholder="État" />
        </Flex>

        <Table
          columns={columns}
          data={jobsResult.data}
          isLoading={isLoading}
          onPageChange={query as any}
          pageCount={jobsResult.count}
          pageIndex={jobsResult.index}
          perPage={PER_PAGE}
        />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
