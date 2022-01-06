import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import DeletionModal from '@app/organisms/DeletionModal'
import queries from '@app/queries'
import { USER_ROLE_LABEL } from '@common/constants'
import { Card, Table, TextInput } from '@singularity/core'
import MaterialDeleteOutlined from '@singularity/core/icons/material/MaterialDeleteOutlined'
import MaterialEditOutlined from '@singularity/core/icons/material/MaterialEditOutlined'
import MaterialPersonOffOutlined from '@singularity/core/icons/material/MaterialPersonOffOutlined'
import MaterialPersonOutlined from '@singularity/core/icons/material/MaterialPersonOutlined'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useRef, useState } from 'react'

import type { User } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core/contents/Table/types'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    isSortable: true,
    key: 'firstName',
    label: 'Prénom',
  },
  {
    isSortable: true,
    key: 'lastName',
    label: 'Nom',
  },
  {
    isSortable: true,
    key: 'email',
    label: 'Email',
  },
  {
    isSortable: true,
    key: 'role',
    label: 'Rôle',
    transform: ({ role }) => USER_ROLE_LABEL[role],
  },
]

export default function AdminUserListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteUser] = useMutation(queries.user.DELETE_ONE)
  const [updateUser] = useMutation(queries.user.UPDATE_ONE)
  const getUsersResult = useQuery(queries.user.GET_ALL, {
    pollInterval: 1000,
  })
  const router = useRouter()

  const isLoading = getUsersResult.loading
  const users = isLoading || getUsersResult.error ? [] : getUsersResult.data.getUsers

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmDeletion = async (id: string) => {
    const user = R.find<User>(R.propEq('id', id))(users)
    if (user === undefined) {
      return
    }

    setSelectedId(id)
    setSelectedEntity(`${user.firstName} ${user.lastName}`)
    setHasDeletionModal(true)
  }

  const deleteAndReload = async () => {
    setHasDeletionModal(false)

    await deleteUser({
      variables: {
        userId: selectedId,
      },
    })
  }

  const goToEditor = (id: string) => {
    router.push(`/admin/user/${id}`)
  }

  const search = debounce(async () => {
    if ($searchInput.current === null) {
      return
    }

    const query = $searchInput.current.value

    getUsersResult.refetch({
      query,
    })
  }, 250)

  const toggleUserIsActive = (id: string, isActive: boolean) => {
    updateUser({
      variables: {
        id,
        input: {
          isActive,
        },
      },
    })
  }

  const columns: TableColumnProps[] = [
    ...BASE_COLUMNS,
    {
      action: toggleUserIsActive,
      IconOff: MaterialPersonOffOutlined,
      IconOn: MaterialPersonOutlined,
      key: 'isActive',
      label: 'Actif·ve',
      labelOff: 'Activer ce compte',
      labelOn: 'Désactiver ce compte',
      type: 'boolean',
      withTooltip: true,
    },
    {
      accent: 'primary',
      action: goToEditor,
      Icon: MaterialEditOutlined,
      label: 'Éditer cet·te utilisateur·rice',
      type: 'action',
    },
    {
      accent: 'danger',
      action: confirmDeletion,
      Icon: MaterialDeleteOutlined,
      label: 'Supprimer cet·te utilisateur·rice',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <Title>Utilisateur·rices</Title>
      </AdminHeader>

      <Card>
        <TextInput ref={$searchInput} onInput={search} placeholder="Rechercher un·e utilisateur·rice" />

        <Table columns={columns} data={users} defaultSortedKey="lastName" isLoading={isLoading} />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
