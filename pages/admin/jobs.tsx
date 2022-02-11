import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import { Flex } from '@app/atoms/Flex'
import Title from '@app/atoms/Title'
import { normalizeDate } from '@app/helpers/normalizeDate'
import { showApolloError } from '@app/helpers/showApolloError'
import { withAdminHocs } from '@app/hocs/withAdminHocs'
import { DeletionModal } from '@app/organisms/DeletionModal'
import queries from '@app/queries'
import { JOB_STATES_AS_OPTIONS, JOB_STATE_LABEL } from '@common/constants'
import { define } from '@common/helpers/define'
import { Button, Card, Select, Table, TextInput } from '@singularity/core'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Edit, Eye, Trash } from 'react-feather'

import type { GetAllResponse } from '@api/resolvers/types'
import type { Job } from '@prisma/client'
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
    transform: ({ expiredAt }) => normalizeDate(expiredAt),
  },
  {
    grow: 0.15,
    key: 'updatedAt',
    label: 'MàJ le',
    transform: ({ updatedAt }) => normalizeDate(updatedAt),
  },
]

const PER_PAGE = 10

function AdminJobListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const $state = useRef('')
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteJob] = useMutation(queries.job.DELETE_ONE)
  const router = useRouter()

  const getJobsResult = useQuery<
    {
      getJobs: GetAllResponse<Job>
    },
    any
  >(queries.job.GET_ALL, {
    pollInterval: 5000,
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

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmDeletion = async (id: string) => {
    const job = R.find<Job>(R.propEq('id', id))(jobsResult.data)
    if (job === undefined) {
      return
    }

    setSelectedId(id)
    setSelectedEntity(job.title)
    setHasDeletionModal(true)
  }

  const deleteAndReload = async () => {
    setHasDeletionModal(false)

    await deleteJob({
      variables: {
        id: selectedId,
      },
    })
  }

  const goToEditor = (id: string) => {
    router.push(`/admin/job/${id}`)
  }

  const goToPreview = (id: string) => {
    const job = R.find<Job>(R.propEq('id', id))(jobsResult.data)
    if (job === undefined) {
      return
    }

    window.open(`/emploi/${job.slug}`, '_blank')
  }

  const handleStateSelect = (option: Common.App.SelectOption | null): void => {
    $state.current = option !== null ? option.value : ''

    query(0)
  }

  const query = useCallback(
    debounce(async (pageIndex: number) => {
      if ($searchInput.current === null) {
        return
      }

      const query = define($searchInput.current.value)
      const state = define($state.current)

      await getJobsResult.refetch({
        pageIndex,
        perPage: PER_PAGE,
        query,
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

  const columns: TableColumnProps[] = [
    ...BASE_COLUMNS,
    {
      accent: 'secondary',
      action: goToPreview,
      Icon: Eye,
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
    {
      accent: 'danger',
      action: confirmDeletion,
      Icon: Trash,
      label: 'Supprimer cette offre',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <Title>Offres</Title>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter une offre
        </Button>
      </AdminHeader>

      <Card>
        <Flex>
          <TextInput ref={$searchInput} onInput={() => query(0)} placeholder="Rechercher une offre" />
          <Select isClearable onChange={handleStateSelect} options={JOB_STATES_AS_OPTIONS} placeholder="État" />
        </Flex>

        <Table
          columns={columns}
          data={jobsResult.data}
          defaultSortedKey="updatedAt"
          defaultSortedKeyIsDesc
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

export default withAdminHocs(AdminJobListPage)
