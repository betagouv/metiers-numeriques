import getPrisma from '@api/helpers/getPrisma'
import { useLazyQuery } from '@apollo/client'
import { FilterRadio } from '@app/atoms/FilterRadio'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { JobCard } from '@app/organisms/JobCard'
import queries from '@app/queries'
import { REGIONS_AS_OPTIONS } from '@common/constants'
import { define } from '@common/helpers/define'
import handleError from '@common/helpers/handleError'
import { JobState } from '@prisma/client'
import debounce from 'lodash.debounce'
import Head from 'next/head'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import type { GetAllResponse } from '@api/resolvers/types'
import type { JobWithRelation } from '@app/organisms/JobCard'
import type { Profession } from '@prisma/client'

const FiltersBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  > label {
    height: 17.75vw;
    margin: 0 0 1vw;
    width: 17.75vw;
  }
  > label:nth-child(5n + 1) {
    margin-left: 0;
  }

  > label:last-child {
    margin-right: 0;
  }

  @media screen and (min-width: 1248px) {
    flex-wrap: nowrap;
    justify-content: space-between;

    > label {
      height: 7.5rem;
      width: 7.5rem;
    }
  }
`

const INITIAL_VARIABLES = {
  pageIndex: 0,
  perPage: 10,
}

type JobListPageProps = {
  initialJobs: JobWithRelation[]
  initialProfessions: Profession[]
}
export default function JobListPage({ initialJobs, initialProfessions }: JobListPageProps) {
  const $isFirstLoad = useRef<boolean>(true)
  const $regionSelect = useRef<HTMLSelectElement>(null)
  const $searchInput = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState(initialJobs)
  const [selectedProfessionId, setSelectedProfessionId] = useState<string | undefined>()

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

  const hasMoreJobs = jobsResult.length > jobs.length
  const nextPageIndex = jobsResult.index + 1
  const pageTitle = 'Liste des offres d’emploi numériques de l’État | metiers.numerique.gouv.fr'
  const pageDescription =
    'Découvrez l’ensemble des offres d’emploi numériques proposées par les services de l’État ' +
    'et les administrations territoriales.'

  const query = useCallback(
    debounce(async (pageIndex: number) => {
      if ($searchInput.current === null || $regionSelect.current === null) {
        return
      }

      setIsLoading(true)

      const isNewQuery = pageIndex === 0
      const query = define($searchInput.current.value)
      const region = define($regionSelect.current.value)

      const newOrAdditionalJobsResult = await getJobs({
        variables: {
          ...INITIAL_VARIABLES,
          pageIndex,
          professionId: selectedProfessionId,
          query,
          region,
        },
      })

      setIsLoading(false)

      if (newOrAdditionalJobsResult.error) {
        handleError(newOrAdditionalJobsResult.error, 'pages/emplois.tsx > query()')

        return
      }

      if (newOrAdditionalJobsResult.data === undefined) {
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
    [jobs, selectedProfessionId],
  )

  const selectProfessionId = useCallback((professionId: string) => {
    setSelectedProfessionId(professionId)
  }, [])

  const unselectProfessionId = useCallback(() => {
    setSelectedProfessionId(undefined)
  }, [])

  useEffect(() => {
    if ($isFirstLoad.current) {
      $isFirstLoad.current = false

      return
    }

    query(0)
  }, [selectedProfessionId])

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <meta content={pageDescription} name="description" />
        <meta content={pageTitle} property="og:title" />
        <meta content={pageDescription} property="og:description" />
      </Head>

      <div className="fr-container fr-mt-2w fr-mb-2w" id="offres-de-mission">
        <div className="fr-grid-row">
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
        <div className="fr-grid-row fr-py-2w">
          <div className="fr-col-12">
            <FiltersBox>
              {initialProfessions.map(profession => (
                <FilterRadio
                  key={profession.id}
                  defaultChecked={profession.id === selectedProfessionId}
                  label={profession.name}
                  name="professionId"
                  onCheck={selectProfessionId}
                  onUncheck={unselectProfessionId}
                  value={profession.id}
                />
              ))}
            </FiltersBox>
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

          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}

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
      initialJobs: normalizedIinitialJobs,
      initialProfessions,
    },
    revalidate: 300,
  }
}
