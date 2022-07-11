import { AdminHeader } from '@app/atoms/AdminHeader'
import { AdminTitle } from '@app/atoms/AdminTitle'
import { Domain } from '@prisma/client'
import { Button, Card, Table, TextInput } from '@singularity/core'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Edit } from 'react-feather'

import type { GetAllResponse } from '@api/resolvers/types'
import type { TableColumnProps } from '@singularity/core'

const PER_PAGE = 10

export default function AdminDomainListPage() {
  const searchInput = useRef<HTMLInputElement>(null)
  const [domains, setDomains] = useState<GetAllResponse<Domain>>({ count: 1, data: [], index: 0, length: 0 })
  const [isLoading, setIsLoading] = useState(false)

  const fetchDomains = async (pageIndex: number) => {
    const searchQuery = searchInput.current?.value
    const query = {
      pageIndex: pageIndex.toString(),
      perPage: PER_PAGE.toString(),
      query: searchQuery || '',
    }
    const queryString = new URLSearchParams(query)

    setIsLoading(true)
    const fetchResponse = await fetch(`/api/domains?${queryString}`)
    const jsonResponse = await fetchResponse.json()

    setDomains(jsonResponse)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchDomains(0)
  }, [])

  const router = useRouter()

  const goToEditor = (id: string) => {
    router.push(`/admin/domain/${id}`)
  }

  const columns: TableColumnProps[] = [
    {
      key: 'name',
      label: 'Nom',
    },
    {
      accent: 'primary',
      action: goToEditor,
      Icon: Edit,
      key: 'edit',
      label: 'Éditer ce domaine',
      type: 'action',
    },
  ]

  return (
    <>
      <AdminHeader>
        <AdminTitle>Domaines</AdminTitle>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter un domaine
        </Button>
      </AdminHeader>

      <Card>
        <TextInput
          ref={searchInput}
          onInput={debounce(() => {
            fetchDomains(0)
          }, 250)}
          placeholder="Rechercher un domaine"
        />

        <Table
          columns={columns}
          data={domains.data}
          isLoading={isLoading}
          onPageChange={fetchDomains}
          pageCount={domains.count}
          pageIndex={domains.index}
          perPage={PER_PAGE}
        />
      </Card>
    </>
  )
}
