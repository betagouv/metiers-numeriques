import { useQuery } from '@apollo/client'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { humanizeDate } from '@app/helpers/humanizeDate'
import { showApolloError } from '@app/helpers/showApolloError'
import { queries } from '@app/queries'
import { define } from '@common/helpers/define'
import { Card, Table, TextInput } from '@singularity/core'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useRef } from 'react'
import { Bell, BellOff } from 'react-feather'

import type { GetAllResponse } from '@api/resolvers/types'
import type { Lead } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const BASE_COLUMNS: TableColumnProps[] = [
  {
    key: 'email',
    label: 'Email',
  },
  {
    IconOff: BellOff,
    IconOn: Bell,
    key: 'withNewsletter',
    label: 'Intitulé',
    labelOff: 'Non publié',
    labelOn: 'Publié',
    type: 'boolean',
  },
  {
    IconOff: BellOff,
    IconOn: Bell,
    key: 'withAlert',
    label: 'Métier',
    labelOff: 'Non publié',
    labelOn: 'Publié',
    type: 'boolean',
  },
  {
    grow: 0.15,
    key: 'createdAt',
    label: 'Inscrit le',
    transform: ({ createdAt }) => humanizeDate(createdAt),
  },
]

const PER_PAGE = 10

export default function AdminLeadListPage() {
  const $searchInput = useRef<HTMLInputElement>(null)

  const getLeadsResult = useQuery<
    {
      getLeads: GetAllResponse<Lead>
    },
    any
  >(queries.lead.GET_ALL, {
    nextFetchPolicy: 'no-cache',
    pollInterval: 500,
    variables: {
      pageIndex: 0,
      perPage: PER_PAGE,
      query: '',
    },
  })

  const isLoading = getLeadsResult.loading
  const leadsResult: GetAllResponse<Lead> =
    isLoading || getLeadsResult.error || getLeadsResult.data === undefined
      ? {
          count: 1,
          data: [],
          index: 0,
          length: 0,
        }
      : getLeadsResult.data.getLeads

  const query = useCallback(
    debounce(async (pageIndex: number) => {
      if ($searchInput.current === null) {
        return
      }

      const query = define($searchInput.current.value)

      getLeadsResult.refetch({
        pageIndex,
        perPage: PER_PAGE,
        query,
      })
    }, 250),
    [],
  )

  useEffect(() => {
    if (getLeadsResult.error === undefined) {
      return
    }

    showApolloError(getLeadsResult.error)
  }, [getLeadsResult.error])

  return (
    <>
      <AdminHeader>
        <Title>Abonné·es</Title>
      </AdminHeader>

      <Card>
        <TextInput ref={$searchInput} onInput={() => query(0)} placeholder="Rechercher un·e abonné·e" />

        <Table
          columns={BASE_COLUMNS}
          data={leadsResult.data}
          isLoading={isLoading}
          onPageChange={query as any}
          pageCount={leadsResult.count}
          pageIndex={leadsResult.index}
          perPage={PER_PAGE}
        />
      </Card>
    </>
  )
}
