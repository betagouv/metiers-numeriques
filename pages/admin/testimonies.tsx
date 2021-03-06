import { AdminHeader } from '@app/atoms/AdminHeader'
import { AdminTitle } from '@app/atoms/AdminTitle'
import { Testimony } from '@prisma/client'
import { Button, Card, Table, TextInput } from '@singularity/core'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Edit } from 'react-feather'

import type { GetAllResponse } from '@api/resolvers/types'
import type { TableColumnProps } from '@singularity/core'

const PER_PAGE = 10

export default function AdminTestimonyListPage() {
  const searchInput = useRef<HTMLInputElement>(null)
  const [testimonies, setTestimonies] = useState<GetAllResponse<Testimony>>({ count: 1, data: [], index: 0, length: 0 })
  const [isLoading, setIsLoading] = useState(false)

  const fetchTestimonies = async (pageIndex: number) => {
    const searchQuery = searchInput.current?.value
    const query = {
      pageIndex: pageIndex.toString(),
      perPage: PER_PAGE.toString(),
      query: searchQuery || '',
    }
    const queryString = new URLSearchParams(query)

    setIsLoading(true)
    const fetchResponse = await fetch(`/api/testimonies?${queryString}`)
    const jsonResponse = await fetchResponse.json()

    setTestimonies(jsonResponse)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTestimonies(0)
  }, [])

  const router = useRouter()

  const goToEditor = (id: string) => {
    router.push(`/admin/testimony/${id}`)
  }

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
    // TODO: handle delete
  ]

  return (
    <>
      <AdminHeader>
        <AdminTitle>Témoignages</AdminTitle>

        <Button onClick={() => goToEditor('new')} size="small">
          Ajouter un témoignage
        </Button>
      </AdminHeader>

      <Card>
        <TextInput
          ref={searchInput}
          onInput={debounce(() => {
            fetchTestimonies(0)
          }, 250)}
          placeholder="Rechercher un témoignage"
        />

        <Table
          columns={columns}
          data={testimonies.data}
          isLoading={isLoading}
          onPageChange={fetchTestimonies}
          pageCount={testimonies.count}
          pageIndex={testimonies.index}
          perPage={PER_PAGE}
        />
      </Card>
    </>
  )
}
