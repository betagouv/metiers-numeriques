import { useQuery, useMutation } from '@apollo/client'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { showApolloError } from '@app/helpers/showApolloError'
import { DeletionModal } from '@app/organisms/DeletionModal'
import { queries } from '@app/queries'
import { define } from '@common/helpers/define'
import { Testimony } from '@prisma/client'
import { Button, Card, Table, TextInput } from '@singularity/core'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Edit, Trash } from 'react-feather'

import type { InstitutionFromGetAll } from '@api/resolvers/institutions'
import type { GetAllResponse } from '@api/resolvers/types'
import type { TableColumnProps } from '@singularity/core'

const PER_PAGE = 10

export default function AdminTestimonyListPage() {
  const [testimonies, setTestimonies] = useState<GetAllResponse<Testimony>>({ count: 1, data: [], index: 0, length: 0 })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch<GetAllResponse<Testimony>>('/api/testimonies')
      .then(res => res.json())
      .then(data => {
        setTestimonies(data)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // const $searchInput = useRef<HTMLInputElement>(null)
  // const [hasDeletionModal, setHasDeletionModal] = useState(false)
  // const [selectedId, setSelectedId] = useState('')
  // const [selectedEntity, setSelectedEntity] = useState('')
  // const [deleteInstitution] = useMutation(queries.institution.DELETE_ONE)
  const router = useRouter()
  //
  // const getInstitutionsResult = useQuery<
  //   {
  //     getInstitutions: GetAllResponse<InstitutionFromGetAll>
  //   },
  //   any
  // >(queries.institution.GET_ALL, {
  //   nextFetchPolicy: 'no-cache',
  //   pollInterval: 500,
  //   variables: {
  //     pageIndex: 0,
  //     perPage: PER_PAGE,
  //   },
  // })
  //
  // const isLoading = getInstitutionsResult.loading
  // const institutionsResult: GetAllResponse<InstitutionFromGetAll> =
  //   isLoading || getInstitutionsResult.error || getInstitutionsResult.data === undefined
  //     ? {
  //         count: 1,
  //         data: [],
  //         index: 0,
  //         length: 0,
  //       }
  //     : getInstitutionsResult.data.getInstitutions

  // const closeDeletionModal = () => {
  //   setHasDeletionModal(false)
  // }

  // const confirmDeletion = async (id: string) => {
  //   const institution = R.find<InstitutionFromGetAll>(R.propEq('id', id))(institutionsResult.data)
  //   if (institution === undefined) {
  //     return
  //   }
  //
  //   setSelectedId(id)
  //   setSelectedEntity(institution.name)
  //   setHasDeletionModal(true)
  // }

  // const deleteAndReload = async () => {
  //   setHasDeletionModal(false)
  //
  //   await deleteInstitution({
  //     variables: {
  //       id: selectedId,
  //     },
  //   })
  // }

  const goToEditor = (id: string) => {
    router.push(`/admin/testimony/${id}`)
  }
  //
  // const query = useCallback(
  //   debounce(async (pageIndex: number) => {
  //     if ($searchInput.current === null) {
  //       return
  //     }
  //
  //     const query = define($searchInput.current.value)
  //
  //     getInstitutionsResult.refetch({
  //       pageIndex,
  //       perPage: PER_PAGE,
  //       query,
  //     })
  //   }, 250),
  //   [],
  // )

  // useEffect(() => {
  //   if (getInstitutionsResult.error === undefined) {
  //     return
  //   }
  //
  //   showApolloError(getInstitutionsResult.error)
  // }, [getInstitutionsResult.error])

  const columns: TableColumnProps[] = [
    {
      key: 'institution.name',
      label: 'Institution',
    },
    {
      key: 'name',
      label: 'Auteur',
    },
    {
      accent: 'primary',
      action: goToEditor,
      Icon: Edit,
      key: 'edit',
      label: 'Éditer ce témoignage',
      type: 'action',
    },
    // {
    //   accent: 'danger',
    //   action: confirmDeletion,
    //   Icon: Trash,
    //   key: 'delete',
    //   label: 'Supprimer cette institution',
    //   type: 'action',
    // },
  ]

  return (
    <>
      <AdminHeader>
        <Title>Témoignages</Title>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter un témoignage
        </Button>
      </AdminHeader>

      <Card>
        {/* <TextInput ref={$searchInput} onInput={() => query(0)} placeholder="Rechercher un témoignage" /> */}

        <Table
          columns={columns}
          data={testimonies.data}
          isLoading={isLoading}
          // onPageChange={query as any}
          pageCount={testimonies.count}
          pageIndex={testimonies.index}
          perPage={PER_PAGE}
        />
      </Card>

      {/* {hasDeletionModal && ( */}
      {/*  <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} /> */}
      {/* )} */}
    </>
  )
}
