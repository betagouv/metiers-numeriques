import { useQuery, useMutation } from '@apollo/client'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { Flex } from '@app/atoms/Flex'
import { Title } from '@app/atoms/Title'
import { showApolloError } from '@app/helpers/showApolloError'
import { DeletionModal } from '@app/organisms/DeletionModal'
import { queries } from '@app/queries'
import { JOB_SOURCES_AS_OPTIONS } from '@common/constants'
import { define } from '@common/helpers/define'
import { JobSource } from '@prisma/client'
import { Button, Card, Select, Table, TextInput } from '@singularity/core'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Edit, Lock, Trash, Unlock } from 'react-feather'

import type { RecruiterFromGetAll } from '@api/resolvers/recruiters'
import type { GetAllResponse } from '@api/resolvers/types'
import type { Recruiter } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    grow: 0.6,
    key: 'displayName',
    label: 'Nom',
  },
  {
    grow: 0.2,
    key: '_count.jobs',
    label: 'Offres',
  },
  {
    grow: 0.2,
    key: '_count.users',
    label: 'Utilisateur·rices',
  },
]

const PER_PAGE = 10

export default function AdminRecruiterListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const $source = useRef('')
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteRecruiter] = useMutation(queries.recruiter.DELETE_ONE)
  const router = useRouter()

  const getRecruitersResult = useQuery<
    {
      getRecruiters: GetAllResponse<RecruiterFromGetAll>
    },
    any
  >(queries.recruiter.GET_ALL, {
    nextFetchPolicy: 'no-cache',
    pollInterval: 500,
    variables: {
      pageIndex: 0,
      perPage: PER_PAGE,
    },
  })

  const isLoading = getRecruitersResult.loading
  const recruitersResult: GetAllResponse<RecruiterFromGetAll> =
    isLoading || getRecruitersResult.error || getRecruitersResult.data === undefined
      ? {
          count: 1,
          data: [],
          index: 0,
          length: 0,
        }
      : getRecruitersResult.data.getRecruiters

  const closeDeletionModal = useCallback(() => {
    setHasDeletionModal(false)
  }, [])

  const confirmDeletion = useCallback(
    async (id: string) => {
      const recruiter = R.find<RecruiterFromGetAll>(R.propEq('id', id))(recruitersResult.data)
      if (recruiter === undefined) {
        return
      }

      setSelectedId(id)
      setSelectedEntity(String(recruiter.displayName))
      setHasDeletionModal(true)
    },
    [recruitersResult.data],
  )

  const deleteAndReload = useCallback(async () => {
    setHasDeletionModal(false)

    await deleteRecruiter({
      variables: {
        id: selectedId,
      },
    })
  }, [selectedId])

  const goToEditor = useCallback((id: string) => {
    router.push(`/admin/recruiter/${id}`)
  }, [])

  const handleSourceSelect = useCallback((option: Common.App.SelectOption | null): void => {
    $source.current = option !== null ? option.value : ''

    query(0)
  }, [])

  const query = useCallback(
    debounce(async (pageIndex: number) => {
      if ($searchInput.current === null) {
        return
      }

      const query = define($searchInput.current.value)
      const source = define($source.current)

      getRecruitersResult.refetch({
        pageIndex,
        perPage: PER_PAGE,
        query,
        source,
      })
    }, 250),
    [],
  )

  useEffect(() => {
    if (getRecruitersResult.error === undefined) {
      return
    }

    showApolloError(getRecruitersResult.error)
  }, [getRecruitersResult.error])

  const columns: TableColumnProps[] = [
    ...BASE_COLUMNS,
    {
      IconOff: Unlock,
      IconOn: Lock,
      key: 'isLocked',
      label: 'Verrou',
      labelOff: 'Ce recruteur n’est pas verrouillé',
      labelOn: 'Ce recruteur est verrouillé car il a été généré automatiquement',
      transform: ({ source }: Recruiter) => source === JobSource.PEP,
      type: 'boolean',
      withTooltip: true,
    },
    {
      accent: 'primary',
      action: goToEditor,
      Icon: Edit,
      key: 'edit',
      label: 'Éditer ce recruteur',
      type: 'action',
    },
    {
      accent: 'danger',
      action: confirmDeletion,
      Icon: Trash,
      key: 'delete',
      label: 'Supprimer ce recruteur',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <Title>Services recruteurs</Title>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter un service recruteur
        </Button>
      </AdminHeader>

      <Card>
        <Flex>
          <TextInput ref={$searchInput} onInput={() => query(0)} placeholder="Rechercher un service recruteur" />
          <Select
            isClearable
            onChange={handleSourceSelect as any}
            options={JOB_SOURCES_AS_OPTIONS}
            placeholder="Source"
          />
        </Flex>

        <Table
          columns={columns}
          data={recruitersResult.data}
          isLoading={isLoading}
          onPageChange={query as any}
          pageCount={recruitersResult.count}
          pageIndex={recruitersResult.index}
          perPage={PER_PAGE}
        />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
