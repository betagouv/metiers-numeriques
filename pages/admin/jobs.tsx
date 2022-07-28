import { useQuery, useMutation } from '@apollo/client'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { AdminTitle } from '@app/atoms/AdminTitle'
import { Flex } from '@app/atoms/Flex'
import { showApolloError } from '@app/helpers/showApolloError'
import { DeletionModal } from '@app/organisms/DeletionModal'
import { queries } from '@app/queries'
import { JOB_SOURCES_AS_OPTIONS, JOB_STATES_AS_OPTIONS, JOB_STATE_LABEL } from '@common/constants'
import { define } from '@common/helpers/define'
import { slugify } from '@common/helpers/slugify'
import { Job, JobContractType, JobRemoteStatus, JobState, UserRole } from '@prisma/client'
import { Button, Card, Select, Table, TextInput } from '@singularity/core'
import cuid from 'cuid'
import dayjs from 'dayjs'
import debounce from 'lodash.debounce'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle, Edit, ExternalLink, Eye, Trash, XCircle } from 'react-feather'
import toast from 'react-hot-toast'

import type { GetAllResponse } from '@api/resolvers/types'
import type { Prisma } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    key: 'title',
    label: 'Intitulé',
  },
  {
    grow: 0.3,
    key: 'recruiter.displayName',
    label: 'Service recruteur',
  },
  {
    grow: 0.15,
    key: '_count.applications',
    label: 'Candidatures',
  },
  {
    grow: 0.15,
    key: 'state',
    label: 'État',
    transform: ({ state }) => JOB_STATE_LABEL[state],
  },
  {
    IconOff: XCircle,
    IconOn: CheckCircle,
    key: 'isActive',
    label: 'MàJ le',
    labelOff: 'Offre pourvue, expirée ou non publiée',
    labelOn: 'Offre active',
    transform: ({ expiredAt, state }) => dayjs(expiredAt).isAfter(dayjs()) && state === JobState.PUBLISHED,
    type: 'boolean',
    withTooltip: true,
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
  const { data: auth } = useSession()
  const [deleteJob] = useMutation(queries.job.DELETE_ONE)
  const [createJob] = useMutation(queries.job.CREATE_ONE)
  const router = useRouter()

  const isAdmin = useMemo(() => auth.user?.role === UserRole.ADMINISTRATOR, [auth.user])

  const getJobsResult = useQuery<
    {
      getJobs: GetAllResponse<Job>
    },
    any
  >(queries.job.GET_ALL, {
    nextFetchPolicy: 'no-cache',
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

  const createAndGoToEditor = useCallback(async () => {
    const id = cuid()
    const title = 'Nouvelle offre d’emploi'
    const slug = slugify(title, id)

    const contractTypes = [JobContractType.NATIONAL_CIVIL_SERVANT_OR_CONTRACT_WORKER]
    const expiredAt = dayjs().add(2, 'months').toDate()
    const missionDescription = ''
    const recruiterId = !isAdmin ? auth.user?.recruiterId : null
    const remoteStatus = JobRemoteStatus.NONE
    const seniorityInMonths = 0
    const state = JobState.DRAFT
    const updatedAt = dayjs().toDate()

    const newJob: Prisma.JobUncheckedCreateInput = {
      contractTypes,
      expiredAt,
      id,
      missionDescription,
      recruiterId,
      remoteStatus,
      seniorityInMonths,
      slug,
      state,
      title,
      updatedAt,
    }

    const createJobResult = await createJob({
      variables: {
        input: newJob,
      },
    })

    if (createJobResult.data.createJob === null) {
      toast.error('La requête GraphQL de création a échoué.')
    }

    goToEditor(createJobResult.data.createJob.id)
  }, [isAdmin])

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

  const goToCandidatePool = useCallback((id: string) => {
    router.push(`/admin/job/${id}/pool`)
  }, [])

  const goToPreview = useCallback((id: string) => {
    window.open(`/emploi/preview/${id}`)
  }, [])

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
        key: 'preview',
        label: 'Prévisualiser cette offre',
        type: 'action',
      },
      {
        accent: 'secondary',
        action: goToCandidatePool,
        Icon: Eye,
        key: 'see-applications',
        label: 'Voir le vivier',
        type: 'action',
      },
      {
        accent: 'primary',
        action: goToEditor,
        Icon: Edit,
        key: 'edit',
        label: 'Éditer cette offre',
        type: 'action',
      },
    ]

    if (isAdmin) {
      dynamicColumns.push({
        accent: 'danger',
        action: confirmDeletion,
        Icon: Trash,
        key: 'delete',
        label: 'Supprimer cette offre',
        type: 'action',
      })
    }

    return dynamicColumns
  }, [jobsResult.data])

  return (
    <>
      <AdminHeader>
        <AdminTitle>Offres d’emploi</AdminTitle>

        <Button onClick={createAndGoToEditor} size="small">
          Ajouter une offre d’emploi
        </Button>
      </AdminHeader>

      <Card>
        <Flex>
          <TextInput ref={$searchInput} onInput={() => query(0)} placeholder="Rechercher une offre d’emploi" />
          <Select
            isClearable
            onChange={handleSourceSelect as any}
            options={JOB_SOURCES_AS_OPTIONS}
            placeholder="Source"
          />
          <Select isClearable onChange={handleStateSelect as any} options={JOB_STATES_AS_OPTIONS} placeholder="État" />
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
