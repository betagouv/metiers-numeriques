import getPrisma from '@api/helpers/getPrisma'
import { useQuery } from '@apollo/client'
import { LegacyJobCard } from '@app/organisms/LegacyJobCard'
import queries from '@app/queries'
import { REGIONS_AS_OPTIONS } from '@common/constants'
import { define } from '@common/helpers/define'
import handleError from '@common/helpers/handleError'
import { JobState } from '@prisma/client'
import dayjs from 'dayjs'
import debounce from 'lodash.debounce'
import Head from 'next/head'
import { useCallback, useRef, useState } from 'react'

import type { GetAllResponse } from '@api/resolvers/types'
import type { LegacyJobWithRelation } from '@app/organisms/LegacyJobCard'

const INITIAL_VARIABLES = {
  pageIndex: 0,
  perPage: 10,
}

type JobListPageProps = {
  initialJobs: LegacyJobWithRelation[]
}
export default function JobListPage({ initialJobs }: JobListPageProps) {
  const $regionSelect = useRef<HTMLSelectElement>(null)
  const $searchInput = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState(initialJobs)

  const getLegacyJobsResult = useQuery<
    {
      getPublicLegacyJobs: GetAllResponse<LegacyJobWithRelation>
    },
    any
  >(queries.legacyJob.GET_ALL_PUBLIC, {
    variables: INITIAL_VARIABLES,
  })

  const legacyJobsResult =
    getLegacyJobsResult.loading || getLegacyJobsResult.error || getLegacyJobsResult.data === undefined
      ? {
          index: 0,
          length: Infinity,
        }
      : getLegacyJobsResult.data.getPublicLegacyJobs

  const query = useCallback(
    debounce(async (pageIndex: number) => {
      if ($searchInput.current === null || $regionSelect.current === null) {
        return
      }

      setIsLoading(true)

      const isNewQuery = pageIndex === 0
      const query = define($searchInput.current.value)
      const region = define($regionSelect.current.value)

      const newOrAdditionalJobsResult = await getLegacyJobsResult.refetch({
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

      const newOrAdditionalJobs = newOrAdditionalJobsResult.data.getPublicLegacyJobs.data

      setIsLoading(false)
      if (isNewQuery) {
        setJobs(newOrAdditionalJobs)
      } else {
        setJobs([...jobs, ...newOrAdditionalJobs])
      }
    }, 500),
    [jobs],
  )

  const hasMoreJobs = legacyJobsResult.length > jobs.length
  const nextPageIndex = legacyJobsResult.index + 1
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

      <div className="fr-container fr-mt-6w fr-mb-2w" id="offres-de-mission">
        <h1
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          Découvrez les offres d’emploi
        </h1>

        <div
          className="hidden-md-flex"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2>Vous ne trouvez pas ?</h2>
          <a
            className="fr-btn fr-fi-add-circle-line fr-btn--icon-right"
            href="https://www.demarches-simplifiees.fr/commencer/metiers-numerique-gouv-fr-candidature-spontanee"
            style={{
              marginBottom: '.5rem',
              marginLeft: '2rem',
            }}
          >
            Déposez une candidature spontanée
          </a>
        </div>

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

          {jobs.map(job => (
            <LegacyJobCard key={job.id} job={job} />
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
  const initialJobs = await prisma.legacyJob.findMany({
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
      state: JobState.PUBLISHED,
    },
  })

  return {
    props: {
      initialJobs: initialJobs.map(initialJob => ({
        ...initialJob,
        createdAt: initialJob.createdAt ? dayjs(initialJob.createdAt).toISOString() : null,
        limitDate: initialJob.limitDate ? dayjs(initialJob.limitDate).toISOString() : null,
        publicationDate: initialJob.publicationDate ? dayjs(initialJob.publicationDate).toISOString() : null,
        updatedAt: initialJob.updatedAt ? dayjs(initialJob.updatedAt).toISOString() : null,
      })),
    },
    revalidate: 300,
  }
}
