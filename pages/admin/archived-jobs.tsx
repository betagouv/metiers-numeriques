import { useQuery, useMutation } from '@apollo/client'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { AdminTitle } from '@app/atoms/AdminTitle'
import { humanizeDate } from '@app/helpers/humanizeDate'
import { showApolloError } from '@app/helpers/showApolloError'
import { DeletionModal } from '@app/organisms/DeletionModal'
import { queries } from '@app/queries'
import { define } from '@common/helpers/define'
import { Card, Table, TextInput } from '@singularity/core'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Edit, ExternalLink, Eye, EyeOff, Save, Trash } from 'react-feather'

import type { GetAllResponse } from '@api/resolvers/types'
import type { ArchivedJob } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    grow: 0.1,
    key: 'source',
    label: 'Source',
  },
  {
    key: 'title',
    label: 'Intitulé',
  },
  {
    grow: 0.2,
    key: 'profession.name',
    label: 'Métier',
  },
  {
    grow: 0.15,
    key: 'expiredAt',
    label: 'Expirée le',
    transform: ({ expiredAt }) => humanizeDate(expiredAt),
  },
  {
    IconOff: EyeOff,
    IconOn: Eye,
    key: 'isPublished',
    label: 'Publication',
    labelOff: 'Non publié',
    labelOn: 'Publié',
    type: 'boolean',
  },
]

const PER_PAGE = 10

export default function AdminArchivedJobListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteArchivedJob] = useMutation(queries.archivedJob.DELETE_ONE)
  const router = useRouter()

  const getArchivedJobsResult = useQuery<
    {
      getArchivedJobs: GetAllResponse<ArchivedJob>
    },
    any
  >(queries.archivedJob.GET_ALL, {
    nextFetchPolicy: 'no-cache',
    pollInterval: 500,
    variables: {
      pageIndex: 0,
      perPage: PER_PAGE,
    },
  })

  const isLoading = getArchivedJobsResult.loading
  const archivedJobsResult: GetAllResponse<ArchivedJob> =
    isLoading || getArchivedJobsResult.error || getArchivedJobsResult.data === undefined
      ? {
          count: 1,
          data: [],
          index: 0,
          length: 0,
        }
      : getArchivedJobsResult.data.getArchivedJobs

  const closeDeletionModal = useCallback(() => {
    setHasDeletionModal(false)
  }, [])

  const confirmDeletion = useCallback(async (id: string) => {
    const archivedJob = R.find<ArchivedJob>(R.propEq('id', id))(archivedJobsResult.data)
    if (archivedJob === undefined) {
      return
    }

    setSelectedId(id)
    setSelectedEntity(archivedJob.title)
    setHasDeletionModal(true)
  }, [])

  const deleteAndReload = useCallback(async () => {
    setHasDeletionModal(false)

    await deleteArchivedJob({
      variables: {
        id: selectedId,
      },
    })
  }, [selectedId])

  const exportAsTxt = useCallback(
    (id: string) => {
      const archivedJob = R.find<ArchivedJob>(R.propEq('id', id))(archivedJobsResult.data)
      if (archivedJob === undefined) {
        return
      }

      let source = `data:text/plain;charset=utf-8,${archivedJob.title}\n\n${archivedJob.missionDescription}`
      if (archivedJob.profileDescription !== null) {
        source += `\n\n${archivedJob.profileDescription}`
      }

      const sourceAsUri = encodeURI(source)
      const $downloadLink = document.createElement('a')
      $downloadLink.setAttribute('href', sourceAsUri)
      $downloadLink.setAttribute('download', `${archivedJob.slug}.txt`)
      document.body.appendChild($downloadLink)

      $downloadLink.click()
    },
    [archivedJobsResult.data],
  )

  const goToEditor = useCallback((id: string) => {
    router.push(`/admin/archived-job/${id}`)
  }, [])

  const goToPreview = useCallback(
    (id: string) => {
      const archivedJob = R.find<ArchivedJob>(R.propEq('id', id))(archivedJobsResult.data)
      if (archivedJob === undefined) {
        return
      }

      window.open(`/emploi/archive/${archivedJob.slug}`, '_blank')
    },
    [archivedJobsResult.data],
  )

  const query = useCallback(
    debounce(async (pageIndex: number) => {
      if ($searchInput.current === null) {
        return
      }

      const query = define($searchInput.current.value)

      getArchivedJobsResult.refetch({
        pageIndex,
        perPage: PER_PAGE,
        query,
      })
    }, 250),
    [],
  )

  useEffect(() => {
    if (getArchivedJobsResult.error === undefined) {
      return
    }

    showApolloError(getArchivedJobsResult.error)
  }, [getArchivedJobsResult.error])

  const columns: TableColumnProps[] = [
    ...BASE_COLUMNS,
    {
      accent: 'warning',
      action: exportAsTxt,
      Icon: Save,
      key: 'export',
      label: 'Prévisualiser cette offre',
      type: 'action',
    },
    {
      accent: 'secondary',
      action: goToPreview,
      Icon: ExternalLink,
      key: 'preview',
      label: 'Prévisualiser cette offre',
      type: 'action',
    },
    {
      accent: 'primary',
      action: goToEditor,
      Icon: Edit,
      key: 'edit',
      label: 'Éditer cette offre archivée',
      type: 'action',
    },
    {
      accent: 'danger',
      action: confirmDeletion,
      Icon: Trash,
      key: 'delete',
      label: 'Supprimer cette offre archivée',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <AdminTitle>Offres archivées</AdminTitle>
      </AdminHeader>

      <Card>
        <TextInput ref={$searchInput} onInput={() => query(0)} placeholder="Rechercher une offre archivée" />

        <Table
          columns={columns}
          data={archivedJobsResult.data}
          isLoading={isLoading}
          onPageChange={query as any}
          pageCount={archivedJobsResult.count}
          pageIndex={archivedJobsResult.index}
          perPage={PER_PAGE}
        />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
