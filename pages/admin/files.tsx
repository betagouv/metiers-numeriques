import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import humanizeDate from '@app/helpers/humanizeDate'
import DeletionModal from '@app/organisms/DeletionModal'
import queries from '@app/queries'
import { FILE_TYPE } from '@common/constants'
import { Card, Table, TextInput } from '@singularity/core'
import MaterialDeleteOutlined from '@singularity/core/icons/material/MaterialDeleteOutlined'
import MaterialEditOutlined from '@singularity/core/icons/material/MaterialEditOutlined'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useRef, useState } from 'react'

import type { File } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    isSortable: true,
    key: 'title',
    label: 'Titre',
  },
  {
    isSortable: true,
    key: 'type',
    label: 'Type',
    transform: ({ type }) => FILE_TYPE[type].label,
  },
  {
    isSortable: true,
    key: 'createdAt',
    label: 'Créé le',
    transform: ({ createdAt }) => humanizeDate(createdAt),
  },
]

export default function AdminFileListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteFile] = useMutation(queries.file.DELETE_ONE)
  const getFilesResult = useQuery(queries.file.GET_ALL, {
    pollInterval: 1000,
  })
  const router = useRouter()

  const isLoading = getFilesResult.loading
  const files = isLoading || getFilesResult.error ? [] : getFilesResult.data.getFiles

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmDeletion = async (id: string) => {
    const file = R.find<File>(R.propEq('id', id))(files)
    if (file === undefined) {
      return
    }

    setSelectedId(id)
    setSelectedEntity(`${file.title} (${file.url})`)
    setHasDeletionModal(true)
  }

  const deleteAndReload = async () => {
    setHasDeletionModal(false)

    await deleteFile({
      variables: {
        id: selectedId,
      },
    })
  }

  const goToEditor = (id: string) => {
    router.push(`/admin/file/${id}`)
  }

  const search = debounce(async () => {
    if ($searchInput.current === null) {
      return
    }

    const query = $searchInput.current.value

    getFilesResult.refetch({
      query,
    })
  }, 250)

  const columns: TableColumnProps[] = [
    ...BASE_COLUMNS,
    {
      accent: 'primary',
      action: goToEditor,
      Icon: MaterialEditOutlined,
      label: 'Éditer ce fichier',
      type: 'action',
    },
    {
      accent: 'danger',
      action: confirmDeletion,
      Icon: MaterialDeleteOutlined,
      label: 'Supprimer ce fichier',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <Title>Fichiers</Title>
      </AdminHeader>

      <Card>
        <TextInput ref={$searchInput} onInput={search} placeholder="Rechercher un fichier" />

        <Table columns={columns} data={files} defaultSortedKey="title" isLoading={isLoading} />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
