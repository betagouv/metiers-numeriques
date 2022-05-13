import { prisma } from '@api/libs/prisma'
import { useLazyQuery } from '@apollo/client'
import { getScrollOffsetFromBottom } from '@app/helpers/getScrollOffsetFromBottom'
import { isObjectEmpty } from '@app/helpers/isObjectEmpty'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { Loader } from '@app/molecules/Loader'
import { JobCard } from '@app/organisms/JobCard'
import { INITIAL_FILTER, JobFilterBar } from '@app/organisms/JobFilterBar'
import { queries } from '@app/queries'
import { handleError } from '@common/helpers/handleError'
import { JobState } from '@prisma/client'
import throttle from 'lodash.throttle'
import Head from 'next/head'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import type { GetAllResponse } from '@api/resolvers/types'
import type { JobWithRelation } from '@app/organisms/JobCard'
import type { Filter } from '@app/organisms/JobFilterBar'
import type { Institution, Profession } from '@prisma/client'

const INITIAL_VARIABLES = {
  pageIndex: 0,
  perPage: 10,
}

const JobListOuterBox = styled.div`
  min-height: calc(100vh - 12rem);

  @media screen and (min-width: 768px) {
    flex-direction: row-reverse;
  }
`

const JobListInnerBox = styled.div`
  @media screen and (min-width: 768px) {
    flex-direction: row-reverse;
  }
`

const CounterSentenceBox = styled.div`
  display: flex;
  line-height: 2;
`

const CounterButtonsBox = styled.div`
  display: flex;
  justify-content: flex-end;
`

const JobFilterBarBox = styled.div`
  @media screen and (max-width: 767px) {
    flex: none;
    width: auto;
  }
`

type JobListPageProps = {
  initialInstitutions: Institution[]
  initialJobs: JobWithRelation[]
  initialJobsLength: number
  initialProfessions: Profession[]
}
export default function JobListPage({
  initialInstitutions,
  initialJobs,
  initialJobsLength,
  initialProfessions,
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
        $jobs.current = newOrAdditionalJobs
        setIsLoading(false)
      } else {
        const newJobs = [...$jobs.current, ...newOrAdditionalJobs]

        $hasMoreJobs.current = getPublicJobs.length > 0 && getPublicJobs.length > newJobs.length
        $nextPageIndex.current += 1

        $jobs.current = newJobs
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
    <div className="fr-pb-4w">
      <Head>
        <title>{pageTitle}</title>

        <meta content={pageDescription} name="description" />
        <meta content={pageTitle} property="og:title" />
        <meta content={pageDescription} property="og:description" />
      </Head>

      <JobListOuterBox className="fr-grid-row">
        <JobFilterBarBox className="fr-col-12 fr-col-md-5">
          <JobFilterBar
            key={jobFilterBarKey}
            institutions={initialInstitutions}
            isModalOpen={isFilterModalOpen}
            onChange={filter => query(0, filter)}
            onModalClose={closeFilterModal}
            professions={initialProfessions}
          />
        </JobFilterBarBox>

        <JobListInnerBox className="fr-col-12 fr-col-md-7">
          <div className="fr-grid-row fr-mt-3w fr-mb-1w">
            <CounterSentenceBox className="fr-col-6 fr-col-md-8">{jobsLengthSentence}</CounterSentenceBox>
            <CounterButtonsBox className="fr-col-6 fr-col-md-4">
              {$hasFilter.current && (
                <button
                  className="fr-btn fr-btn--secondary rf-btn--error fr-btn--icon-left fr-fi-close-line"
                  onClick={resetFilter}
                  type="button"
                >
                  Réinitialiser
                </button>
              )}

              <button
                className="fr-btn fr-btn--secondary rf-hidden-md fr-ml-2w"
                onClick={openFilterModal}
                type="button"
              >
                Filtres
              </button>
            </CounterButtonsBox>
          </div>

          {$isLoading.current && <Loader />}

          {!$isLoading.current && $jobs.current.map(job => <JobCard key={job.id} job={job} />)}

          {$isLoadingMore.current && <Loader />}
        </JobListInnerBox>
      </JobListOuterBox>
    </div>
  )
}

export async function getStaticProps() {
  const whereFilter = {
    where: {
      AND: {
        expiredAt: {
          gt: new Date(),
        },
        state: JobState.PUBLISHED,
      },
    },
  }

  const initialJobsLength = await prisma.job.count(whereFilter)

  const initialInstitutions = await prisma.institution.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
    },
  })

  const initialJobs = await prisma.job.findMany({
    include: {
      address: true,
      applicationContacts: true,
      infoContact: true,
      profession: true,
      recruiter: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: INITIAL_VARIABLES.perPage,
    ...whereFilter,
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

  const normalizedIinitialJobs = initialJobs.map(stringifyDeepDates)

  return {
    props: {
      initialInstitutions,
      initialJobs: normalizedIinitialJobs,
      initialJobsLength,
      initialProfessions,
    },
    revalidate: 300,
  }
}
