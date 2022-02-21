import getPrisma from '@api/helpers/getPrisma'
import { useQuery } from '@apollo/client'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { JobCard } from '@app/organisms/JobCard'
import { LegacyJobCard } from '@app/organisms/LegacyJobCard'
import queries from '@app/queries'
import { REGIONS_AS_OPTIONS } from '@common/constants'
import { define } from '@common/helpers/define'
import handleError from '@common/helpers/handleError'
import { JobState } from '@prisma/client'
import debounce from 'lodash.debounce'
import Head from 'next/head'
import * as R from 'ramda'
import { useCallback, useRef, useState } from 'react'

import type { GetAllResponse } from '@api/resolvers/types'
import type { JobWithRelation } from '@app/organisms/JobCard'
import type { LegacyJobWithRelation } from '@app/organisms/LegacyJobCard'

const INITIAL_VARIABLES = {
  pageIndex: 0,
  perPage: 10,
}

type JobListPageProps = {
  initialJobs: Array<JobWithRelation | LegacyJobWithRelation>
}
export default function JobListPage({ initialJobs }: JobListPageProps) {
  const $regionSelect = useRef<HTMLSelectElement>(null)
  const $searchInput = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState(initialJobs)

  const getJobsResult = useQuery<
    {
      getPublicJobs: GetAllResponse<JobWithRelation | LegacyJobWithRelation>
    },
    any
  >(queries.job.GET_ALL_PUBLIC, {
    variables: INITIAL_VARIABLES,
  })

  const jobsResult =
    getJobsResult.loading || getJobsResult.error || getJobsResult.data === undefined
      ? {
          index: 0,
          length: Infinity,
        }
      : getJobsResult.data.getPublicJobs

  const query = useCallback(
    debounce(async (pageIndex: number) => {
      if ($searchInput.current === null || $regionSelect.current === null) {
        return
      }

      setIsLoading(true)

      const isNewQuery = pageIndex === 0
      const query = define($searchInput.current.value)
      const region = define($regionSelect.current.value)

      const newOrAdditionalJobsResult = await getJobsResult.refetch({
        ...INITIAL_VARIABLES,
        pageIndex,
        query,
        region,
      })

      setIsLoading(false)

      if (newOrAdditionalJobsResult.error) {
        handleError(newOrAdditionalJobsResult.error, 'pages/emplois.tsx > query()')

        return
      }

      const newOrAdditionalJobs = newOrAdditionalJobsResult.data.getPublicJobs.data

      setIsLoading(false)
      if (isNewQuery) {
        setJobs(newOrAdditionalJobs)
      } else {
        setJobs([...jobs, ...newOrAdditionalJobs])
      }
    }, 500),
    [jobs],
  )

  const hasMoreJobs = jobsResult.length > jobs.length
  const nextPageIndex = jobsResult.index + 1
  const pageTitle = 'Liste des offres d’emploi numériques de l’État | metiers.numerique.gouv.fr'
  const pageDescription =
    'Découvrez l’ensemble des offres d’emploi numériques proposées par les services de l’État ' +
    'et les administrations territoriales.'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <meta content={pageDescription} name="description" />
        <meta content={pageTitle} property="og:title" />
        <meta content={pageDescription} property="og:description" />
      </Head>

      <div className="fr-container fr-mt-2w fr-mb-2w" id="offres-de-mission">
        <div className="fr-grid-row fr-py-2w">
          <div className="fr-col-12 fr-col-md-7">
            <label className="fr-label" htmlFor="JobsSearchInput">
              Métier
            </label>
            <div className="fr-input-wrap fr-mt-1w fr-fi-search-line">
              <input
                ref={$searchInput}
                className="fr-input"
                id="JobsSearchInput"
                onInput={() => query(0)}
                type="text"
              />
            </div>
          </div>

          <div className="fr-col-12 fr-pt-2w fr-col-md-5 fr-pt-md-0 fr-pl-md-2w">
            <label className="fr-label" htmlFor="JobsRegionSelect">
              Région
            </label>
            <div className="fr-input-wrap fr-mt-1w">
              <select ref={$regionSelect} className="fr-select" onChange={() => query(0)}>
                <option value="">Toutes</option>
                {REGIONS_AS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="fr-grid-row">
          {jobs.length === 0 && (
            <div
              className="fr-py-4w"
              style={{
                textAlign: 'center',
                width: '100%',
              }}
            >
              <p>Il n’y a aucune offre disponible satisfaisant cette recherche.</p>
            </div>
          )}

          {jobs.map(job => {
            if (!R.isNil((job as any).missionDescription)) {
              return <JobCard key={job.id} job={job as JobWithRelation} />
            }

            return <LegacyJobCard key={job.id} job={job as LegacyJobWithRelation} />
          })}

          {isLoading && (
            <div
              className="fr-my-4w"
              style={{
                textAlign: 'center',
                width: '100%',
              }}
            >
              <i
                className="ri-loader-4-fill rotating"
                style={{
                  display: 'inline-block',
                  fontSize: '2em',
                }}
              />
            </div>
          )}
        </div>

        {hasMoreJobs && (
          <div className="fr-py-4w" id="LoadMoreSection">
            <button className="fr-btn" disabled={isLoading} onClick={() => query(nextPageIndex)} type="button">
              Afficher plus de résultats
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export async function getStaticProps() {
  const prisma = getPrisma()

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
    where: {
      state: JobState.PUBLISHED,
    },
  })

  const initialLegacyJobs = await prisma.legacyJob.findMany({
    include: {
      legacyService: {
        include: {
          legacyEntity: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: INITIAL_VARIABLES.perPage,
    where: {
      isMigrated: false,
      state: JobState.PUBLISHED,
    },
  })

  const initialData = R.pipe(
    R.sort(R.descend(R.prop('updatedAt') as any)),
    R.slice(0, INITIAL_VARIABLES.perPage) as any,
    R.map(stringifyDeepDates),
  )([...initialJobs, ...initialLegacyJobs])

  return {
    props: {
      initialJobs: initialData,
    },
    revalidate: 300,
  }
}
