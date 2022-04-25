import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import { showApolloError } from '@app/helpers/showApolloError'
import { DeletionModal } from '@app/organisms/DeletionModal'
import queries from '@app/queries'
import { define } from '@common/helpers/define'
import { Button, Card, Table, TextInput } from '@singularity/core'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Edit, Trash } from 'react-feather'

import type { GetAllResponse } from '@api/resolvers/types'
import type { Contact } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    key: 'name',
    label: 'Nom',
  },
  {
    grow: 0.3,
    key: 'email',
    label: 'Email',
  },
  {
    grow: 0.2,
    key: 'phone',
    label: 'Téléphone',
  },
]

const PER_PAGE = 10

export default function AdminContactListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteContact] = useMutation(queries.contact.DELETE_ONE)
  const router = useRouter()

  const getContactsResult = useQuery<
    {
      getContacts: GetAllResponse<Contact>
    },
    any
  >(queries.contact.GET_ALL, {
    nextFetchPolicy: 'no-cache',
    pollInterval: 500,
    variables: {
      pageIndex: 0,
      perPage: PER_PAGE,
    },
  })

  const isLoading = getContactsResult.loading
  const contactsResult: GetAllResponse<Contact> =
    isLoading || getContactsResult.error || getContactsResult.data === undefined
      ? {
          count: 1,
          data: [],
          index: 0,
          length: 0,
        }
      : getContactsResult.data.getContacts

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmDeletion = async (id: string) => {
    const contact = R.find<Contact>(R.propEq('id', id))(contactsResult.data)
    if (contact === undefined) {
      return
    }

    setSelectedId(id)
    setSelectedEntity(contact.name)
    setHasDeletionModal(true)
  }

  const deleteAndReload = async () => {
    setHasDeletionModal(false)

    await deleteContact({
      variables: {
        id: selectedId,
      },
    })
  }

  const goToEditor = (id: string) => {
    router.push(`/admin/contact/${id}`)
  }

  const query = useCallback(
    debounce(async (pageIndex: number) => {
      if ($searchInput.current === null) {
        return
      }

      const query = define($searchInput.current.value)

      getContactsResult.refetch({
        pageIndex,
        perPage: PER_PAGE,
        query,
      })
    }, 250),
    [],
  )

  useEffect(() => {
    if (getContactsResult.error === undefined) {
      return
    }

    showApolloError(getContactsResult.error)
  }, [getContactsResult.error])

  const columns: TableColumnProps[] = [
    ...BASE_COLUMNS,
    {
      accent: 'primary',
      action: goToEditor,
      Icon: Edit,
      key: 'edit',
      label: 'Éditer ce contact',
      type: 'action',
    },
    {
      accent: 'danger',
      action: confirmDeletion,
      Icon: Trash,
      key: 'delete',
      label: 'Supprimer ce contact',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <Title>Contacts</Title>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter un contact
        </Button>
      </AdminHeader>

      <Card>
        <TextInput ref={$searchInput} onInput={() => query(0)} placeholder="Rechercher un contact" />

        <Table
          columns={columns}
          data={contactsResult.data}
          isLoading={isLoading}
          onPageChange={query as any}
          pageCount={contactsResult.count}
          pageIndex={contactsResult.index}
          perPage={PER_PAGE}
        />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
