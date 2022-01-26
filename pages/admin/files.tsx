import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import humanizeDate from '@app/helpers/humanizeDate'
import { DeletionModal } from '@app/organisms/DeletionModal'
import queries from '@app/queries'
import { FILE_TYPE } from '@common/constants'
import { define } from '@common/helpers/define'
import { Card, Table, TextInput } from '@singularity/core'
import MaterialDeleteOutlined from '@singularity/core/icons/material/MaterialDeleteOutlined'
import MaterialEditOutlined from '@singularity/core/icons/material/MaterialEditOutlined'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useRef, useState } from 'react'

import type { GetAllResponse } from '@api/resolvers/types'
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

const PER_PAGE = 10

export default function AdminFileListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteFile] = useMutation(queries.file.DELETE_ONE)
  const router = useRouter()

  const getFilesResult = useQuery<
    {
      getFiles: GetAllResponse<File>
    },
    any
  >(queries.file.GET_ALL, {
    pollInterval: 5000,
    variables: {
      pageIndex: 0,
      perPage: PER_PAGE,
    },
  })

  const isLoading = getFilesResult.loading
  const filesResult: GetAllResponse<File> =
    isLoading || getFilesResult.error || getFilesResult.data === undefined
      ? {
          count: 1,
          data: [],
          index: 0,
          length: 0,
        }
      : getFilesResult.data.getFiles

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmDeletion = async (id: string) => {
    const file = R.find<File>(R.propEq('id', id))(filesResult.data)
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

  const query = debounce(async (pageIndex: number) => {
    if ($searchInput.current === null) {
      return
    }

    const query = define($searchInput.current.value)

    getFilesResult.refetch({
      pageIndex,
      perPage: PER_PAGE,
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
        <TextInput ref={$searchInput} onInput={() => query(0)} placeholder="Rechercher un fichier" />

        <Table
          columns={columns}
          data={filesResult.data}
          defaultSortedKey="updatedAt"
          defaultSortedKeyIsDesc
          isLoading={isLoading}
          onPageChange={query as any}
          pageCount={filesResult.count}
          pageIndex={filesResult.index}
          perPage={PER_PAGE}
        />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
