import { prisma } from '@api/libs/prisma'
import { useLazyQuery } from '@apollo/client'
import { isObjectEmpty } from '@app/helpers/isObjectEmpty'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { Loader } from '@app/molecules/Loader'
import { JobCard } from '@app/organisms/JobCard'
import { INITIAL_FILTER, JobFilterBar } from '@app/organisms/JobFilterBar'
import queries from '@app/queries'
import { handleError } from '@common/helpers/handleError'
import { JobState } from '@prisma/client'
import debounce from 'lodash.debounce'
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
  const $jobsLength = useRef<number>(initialJobsLength)
  const [jobFilterBarKey, setJobFilterBarKey] = useState<number>(1)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [jobs, setJobs] = useState(initialJobs)

  const [getJobs, getJobsResult] = useLazyQuery<
    {
      getPublicJobs: GetAllResponse<JobWithRelation>
    },
    any
  >(queries.job.GET_ALL_PUBLIC)

  const jobsResult =
    getJobsResult.loading || getJobsResult.error || getJobsResult.data === undefined
      ? {
          index: 0,
          length: Infinity,
        }
      : getJobsResult.data.getPublicJobs

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
  const hasMoreJobs = jobs.length > 0 && jobsResult.length > jobs.length
  const nextPageIndex = jobsResult.index + 1
  const pageTitle = 'Liste des offres d’emploi numériques de l’État | metiers.numerique.gouv.fr'
  const pageDescription =
    'Découvrez l’ensemble des offres d’emploi numériques proposées par les services de l’État ' +
    'et les administrations territoriales.'

  const closeFilterModal = useCallback(() => {
    setIsFilterModalOpen(false)
  }, [])

  const openFilterModal = useCallback(() => {
    setIsFilterModalOpen(true)
  }, [])

  const query = useCallback(
    debounce(async (pageIndex: number, filter: Filter = INITIAL_FILTER) => {
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

      const newOrAdditionalJobs = newOrAdditionalJobsResult.data.getPublicJobs.data

      $hasFilter.current = !isObjectEmpty(filter)
      $jobsLength.current = newOrAdditionalJobsResult.data.getPublicJobs.length

      if (isNewQuery) {
        setIsLoading(false)
      } else {
        setIsLoadingMore(false)
      }

      if (isNewQuery) {
        setJobs(newOrAdditionalJobs)
      } else {
        setJobs([...jobs, ...newOrAdditionalJobs])
      }
    }, 500),
    [jobs],
  )

  const resetFilter = useCallback(() => {
    setJobFilterBarKey(jobFilterBarKey + 1)
  }, [jobFilterBarKey])

  useEffect(() => {
    document.body.style.overflowY = isFilterModalOpen ? 'hidden' : 'auto'
  }, [isFilterModalOpen])

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

          {isLoading && <Loader />}

          {!isLoading && jobs.map(job => <JobCard key={job.id} job={job} />)}

          {isLoadingMore && <Loader />}

          {!isLoading && !isLoadingMore && hasMoreJobs && (
            <div className="fr-py-4w rf-text-center">
              <button className="fr-btn" disabled={isLoading} onClick={() => query(nextPageIndex)} type="button">
                Afficher plus de résultats
              </button>
            </div>
          )}
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
