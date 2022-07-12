import { prisma } from '@api/libs/prisma'
import { useLazyQuery } from '@apollo/client'
import { Button } from '@app/atoms/Button'
import { Title } from '@app/atoms/Title'
import { getScrollOffsetFromBottom } from '@app/helpers/getScrollOffsetFromBottom'
import { isObjectEmpty } from '@app/helpers/isObjectEmpty'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { Loader } from '@app/molecules/Loader'
import { JobCard, JobWithRelation } from '@app/organisms/JobCard'
import { INITIAL_FILTER, JobFilterBar } from '@app/organisms/JobFilterBar'
import { queries } from '@app/queries'
import { theme } from '@app/theme'
import { handleError } from '@common/helpers/handleError'
import { Domain, JobState } from '@prisma/client'
import throttle from 'lodash.throttle'
import Head from 'next/head'
import { mergeDeepRight } from 'ramda'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import type { GetAllResponse } from '@api/resolvers/types'
import type { Filter } from '@app/organisms/JobFilterBar'
import type { Profession, Prisma } from '@prisma/client'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

const INITIAL_VARIABLES = {
  pageIndex: 0,
  perPage: 10,
}

const CounterBox = styled.div`
  align-items: center;
  display: flex;
  height: 5rem;
  justify-content: space-between;

  @media screen and (min-width: 768px) {
    margin: 2rem 0 0 0;
  }
`

const FilterButtonBox = styled.div`
  @media screen and (min-width: 768px) {
    display: none;
  }
`

const CounterSentenceBox = styled.p`
  display: flex;
  font-size: ${theme.typography.desktop.body.normal.size};
  line-height: 1;
  padding: 0 0 0.5rem 0;
`

const CounterButtonsBox = styled.div`
  display: flex;
  justify-content: flex-end;

  > .Button:not(:first-child) {
    margin: 0 0 0 1rem;
  }
`

const List = styled.div`
  display: flex;
  flex-direction: column;

  > .JobCard {
    margin-bottom: 1rem;
  }
`

type JobListPageProps = {
  initialDomains: Pick<Domain, 'id' | 'name'>[]
  initialJobs: JobWithRelation[]
  initialJobsLength: number
  initialProfessions: Pick<Profession, 'id' | 'name'>[]
  initialQueryFilter?: string
}
export default function JobListPage({
  initialDomains,
  initialJobs,
  initialJobsLength,
  initialProfessions,
  initialQueryFilter,
}: JobListPageProps) {
  const $hasFilter = useRef<boolean>(false)
  const $hasMoreJobs = useRef<boolean>(initialJobs.length > 0 && initialJobsLength > initialJobs.length)
  const $nextPageIndex = useRef<number>(1)
  const $isLoading = useRef<boolean>(false)
  const $isLoadingMore = useRef<boolean>(false)
  const $jobs = useRef(initialJobs)
  const $jobsLength = useRef<number>(initialJobsLength)
  const [jobFilterBarKey, setJobFilterBarKey] = useState<number>(1)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)
  const [, updateState] = useState({})

  const [getJobs] = useLazyQuery<
    {
      getPublicJobs: GetAllResponse<JobWithRelation>
    },
    any
  >(queries.job.GET_ALL_PUBLIC)

  const jobsLengthSentence = useMemo(() => {
    switch ($jobsLength.current) {
      case 0:
        if ($hasFilter.current) {
          return 'Aucune offre d’emploi trouvée.'
        }

        return 'Aucune offre d’emploi n’est disponible pour le moment.'

      case 1:
        if ($hasFilter.current) {
          return 'Une offre d’emploi trouvée.'
        }

        return 'Une offre d’emploi disponible.'

      default:
        if ($hasFilter.current) {
          return `${$jobsLength.current} offres d’emploi trouvées.`
        }

        return `${$jobsLength.current} offres d’emploi disponibles.`
    }
  }, [$hasFilter.current, $jobsLength.current])

  const pageTitle = 'Offres d’emploi | Métiers du Numérique'
  const pageDescription =
    'Découvrez l’ensemble des offres d’emploi du numérique dans l’État et les administrations territoriales.'

  const closeFilterModal = useCallback(() => {
    setIsFilterModalOpen(false)
  }, [])

  const forceUpdate = useCallback(() => {
    updateState({})
  }, [])

  const openFilterModal = useCallback(() => {
    setIsFilterModalOpen(true)
  }, [])

  const query = useCallback(
    throttle(async (pageIndex: number, filter: Filter = INITIAL_FILTER) => {
      const isNewQuery = pageIndex === 0

      if (isNewQuery) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      const newOrAdditionalJobsResult = await getJobs({
        variables: {
          ...INITIAL_VARIABLES,
          pageIndex,
          ...filter,
        },
      })

      if (newOrAdditionalJobsResult.error) {
        handleError(newOrAdditionalJobsResult.error, 'pages/emplois.tsx > query()')

        if (isNewQuery) {
          setIsLoading(false)
        } else {
          setIsLoadingMore(false)
        }

        return
      }

      if (newOrAdditionalJobsResult.data === undefined) {
        if (isNewQuery) {
          setIsLoading(false)
        } else {
          setIsLoadingMore(false)
        }

        return
      }

      const { getPublicJobs } = newOrAdditionalJobsResult.data
      const newOrAdditionalJobs = getPublicJobs.data

      $hasFilter.current = !isObjectEmpty(filter)
      $jobsLength.current = getPublicJobs.length

      if (isNewQuery) {
        $hasMoreJobs.current = getPublicJobs.length > 0 && getPublicJobs.length > newOrAdditionalJobs.length
        $jobs.current = newOrAdditionalJobs
        $nextPageIndex.current = 1
        setIsLoading(false)
      } else {
        const newJobs = [...$jobs.current, ...newOrAdditionalJobs]

        $hasMoreJobs.current = getPublicJobs.length > 0 && getPublicJobs.length > newJobs.length
        $jobs.current = newJobs
        $nextPageIndex.current += 1
        setIsLoadingMore(false)
      }
    }, 1000),
    [],
  )

  const resetFilter = useCallback(() => {
    setJobFilterBarKey(jobFilterBarKey + 1)
  }, [jobFilterBarKey])

  const setIsLoading = useCallback(
    (state: boolean) => {
      $isLoading.current = state
      forceUpdate()
    },
    [jobFilterBarKey],
  )

  const setIsLoadingMore = useCallback(
    (state: boolean) => {
      $isLoadingMore.current = state
      forceUpdate()
    },
    [jobFilterBarKey],
  )

  useEffect(() => {
    window.document.body.style.overflowY = isFilterModalOpen ? 'hidden' : 'auto'
  }, [isFilterModalOpen])

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if ($isLoading.current || $isLoadingMore.current || !$hasMoreJobs.current) {
        return
      }

      const scrollOffsetFromBottom = getScrollOffsetFromBottom()
      if (scrollOffsetFromBottom > 500) {
        return
      }

      query($nextPageIndex.current)
    })
  }, [])

  return (
    <div className="fr-container fr-py-4w">
      <Head>
        <title>{pageTitle}</title>

        <meta content={pageDescription} name="description" />
        <meta content={pageTitle} property="og:title" />
        <meta content={pageDescription} property="og:description" />
      </Head>

      <Title as="h1" isFirst>
        Toutes les offres
      </Title>

      <JobFilterBar
        key={jobFilterBarKey}
        defaultQuery={initialQueryFilter}
        domains={initialDomains}
        isModalOpen={isFilterModalOpen}
        onChange={filter => query(0, filter)}
        onModalClose={closeFilterModal}
        professions={initialProfessions}
      />

      <CounterBox>
        <CounterSentenceBox>{jobsLengthSentence}</CounterSentenceBox>
        <CounterButtonsBox>
          {$hasFilter.current && (
            <Button accent="secondary" onClick={resetFilter} size="medium">
              Réinitialiser
            </Button>
          )}

          <FilterButtonBox>
            <Button accent="secondary" onClick={openFilterModal} size="medium">
              Filtres
            </Button>
          </FilterButtonBox>
        </CounterButtonsBox>
      </CounterBox>

      <List>
        {$isLoading.current && <Loader />}
        {!$isLoading.current && $jobs.current.map(job => <JobCard key={job.id} job={job} />)}
        {$isLoadingMore.current && <Loader />}
      </List>
    </div>
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<JobListPageProps>> {
  const { query } = context.query
  const initialQueryFilter = typeof query === 'string' ? query : undefined

  const whereFilterBase: Prisma.JobWhereInput = {
    AND: {
      expiredAt: {
        gt: new Date(),
      },
      state: JobState.PUBLISHED,
    },
  }
  const whereFilter: Prisma.JobWhereInput = initialQueryFilter
    ? mergeDeepRight(whereFilterBase, {
        AND: {
          title: {
            contains: initialQueryFilter,
            mode: 'insensitive',
          },
        },
      })
    : whereFilterBase

  const initialJobsLength = await prisma.job.count({
    where: whereFilter,
  })

  const initialJobs = await prisma.job.findMany({
    include: {
      address: true,
      applicationContacts: true,
      domains: true,
      infoContact: true,
      profession: true,
      recruiter: {
        include: {
          institution: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: INITIAL_VARIABLES.perPage,
    where: whereFilter,
  })

  const initialProfessions = await prisma.profession.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
    },
  })

  const initialDomains = await prisma.domain.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
    },
  })

  const normalizedIinitialJobs = initialJobs.map(stringifyDeepDates)

  return {
    props: {
      initialDomains,
      initialJobs: normalizedIinitialJobs,
      initialJobsLength,
      initialProfessions,
      initialQueryFilter,
    },
  }
}
