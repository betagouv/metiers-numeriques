import { useQuery, useMutation } from '@apollo/client'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { getCountryFromCode } from '@app/helpers/getCountryFromCode'
import { showApolloError } from '@app/helpers/showApolloError'
import { DeletionModal } from '@app/organisms/DeletionModal'
import { queries } from '@app/queries'
import { define } from '@common/helpers/define'
import { Button, Card, Table, TextInput } from '@singularity/core'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Edit, Trash } from 'react-feather'

import type { GetAllResponse } from '@api/resolvers/types'
import type { Address } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    key: 'street',
    label: 'Rue',
  },
  {
    grow: 0.1,
    key: 'postalCode',
    label: 'CP',
  },
  {
    grow: 0.2,
    key: 'city',
    label: 'Ville',
  },
  {
    grow: 0.2,
    key: 'region',
    label: 'Région',
  },
  {
    grow: 0.2,
    key: 'country',
    label: 'Pays',
    transform: ({ country }) => getCountryFromCode(country),
  },
]

const PER_PAGE = 10

export default function AdminAddressListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)
  const [hasDeletionModal, setHasDeletionModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedEntity, setSelectedEntity] = useState('')
  const [deleteAddress] = useMutation(queries.address.DELETE_ONE)
  const router = useRouter()

  const getAddressesResult = useQuery<
    {
      getAddresses: GetAllResponse<Address>
    },
    any
  >(queries.address.GET_ALL, {
    nextFetchPolicy: 'no-cache',
    pollInterval: 500,
    variables: {
      pageIndex: 0,
      perPage: PER_PAGE,
    },
  })

  const isLoading = getAddressesResult.loading
  const addressesResult: GetAllResponse<Address> =
    isLoading || getAddressesResult.error || getAddressesResult.data === undefined
      ? {
          count: 1,
          data: [],
          index: 0,
          length: 0,
        }
      : getAddressesResult.data.getAddresses

  const closeDeletionModal = () => {
    setHasDeletionModal(false)
  }

  const confirmDeletion = async (id: string) => {
    const address = R.find<Address>(R.propEq('id', id))(addressesResult.data)
    if (address === undefined) {
      return
    }

    setSelectedId(id)
    setSelectedEntity(`${address.street}, ${address.postalCode} ${address.city}`)
    setHasDeletionModal(true)
  }

  const deleteAndReload = async () => {
    setHasDeletionModal(false)

    await deleteAddress({
      variables: {
        id: selectedId,
      },
    })
  }

  const goToEditor = (id: string) => {
    router.push(`/admin/address/${id}`)
  }

  const query = useCallback(
    debounce(async (pageIndex: number) => {
      if ($searchInput.current === null) {
        return
      }

      const query = define($searchInput.current.value)

      getAddressesResult.refetch({
        pageIndex,
        perPage: PER_PAGE,
        query,
      })
    }, 250),
    [],
  )

  useEffect(() => {
    if (getAddressesResult.error === undefined) {
      return
    }

    showApolloError(getAddressesResult.error)
  }, [getAddressesResult.error])

  const columns: TableColumnProps[] = [
    ...BASE_COLUMNS,
    {
      accent: 'primary',
      action: goToEditor,
      Icon: Edit,
      key: 'edit',
      label: 'Éditer cette adresse',
      type: 'action',
    },
    {
      accent: 'danger',
      action: confirmDeletion,
      Icon: Trash,
      key: 'delete',
      label: 'Supprimer cette adresse',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <Title>Adresses</Title>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter une adresse
        </Button>
      </AdminHeader>

      <Card>
        <TextInput ref={$searchInput} onInput={() => query(0)} placeholder="Rechercher une adresse" />

        <Table
          columns={columns}
          data={addressesResult.data}
          isLoading={isLoading}
          onPageChange={query as any}
          pageCount={addressesResult.count}
          pageIndex={addressesResult.index}
          perPage={PER_PAGE}
        />
      </Card>

      {hasDeletionModal && (
        <DeletionModal entity={selectedEntity} onCancel={closeDeletionModal} onConfirm={deleteAndReload} />
      )}
    </>
  )
}
