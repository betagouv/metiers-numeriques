import getPrisma from '@api/helpers/getPrisma'
import { useQuery } from '@apollo/client'
import JobCard from '@app/organisms/JobCard'
import queries from '@app/queries'
import handleError from '@common/helpers/handleError'
import { JobSource } from '@prisma/client'
import dayjs from 'dayjs'
import debounce from 'lodash.debounce'
import Head from 'next/head'
import * as R from 'ramda'
import { useCallback, useRef, useState } from 'react'

import type { LegacyJobWithRelation } from '@app/organisms/JobCard'

const PAGE_LENGTH = 10

const getJobIds = R.map<LegacyJobWithRelation, string>(R.prop('id'))
const excludeDuplicateJobs = (existingJobIds: string[], jobs: LegacyJobWithRelation[]): LegacyJobWithRelation[] =>
  R.reject((job: LegacyJobWithRelation) => existingJobIds.includes(job.id))(jobs)

const getLastJobId = (jobs: LegacyJobWithRelation[]): string => {
  const lastJob = R.last(jobs)
  if (lastJob === undefined) {
    return ''
  }

  return lastJob.id
}

type JobListPageProps = {
  initialJobs: LegacyJobWithRelation[]
}
export default function JobListPage({ initialJobs }: JobListPageProps) {
  const $jobIds = useRef(getJobIds(initialJobs))
  const $lastJobId = useRef(getLastJobId(initialJobs))
  const $wasSearching = useRef(false)
  const $searchInput = useRef<HTMLInputElement>(null)
  const [jobs, setJobs] = useState(initialJobs)
  const [isLoading, setIsLoading] = useState(false)

  const getLegacyJobsResult = useQuery(queries.legacyJob.GET_ALL, {
    variables: {
      pageLength: PAGE_LENGTH,
    },
  })

  const loadMoreJobs = useCallback(
    async (isReset: boolean = false) => {
      setIsLoading(true)

      const fromId = isReset ? undefined : $lastJobId.current
      const query =
        $searchInput.current && $searchInput.current.value.trim().length > 0
          ? $searchInput.current.value.trim()
          : undefined

      // TODO Fix this horrible hack!
      const result = await getLegacyJobsResult.fetchMore({
        variables: {
          fromId,
          pageLength: PAGE_LENGTH,
          query,
        },
      })

      if (getLegacyJobsResult.error !== undefined) {
        handleError(getLegacyJobsResult.error, 'pages/emplois.tsx > loadMoreJobs()')
        setIsLoading(false)

        return
      }

      const additionalJobs: LegacyJobWithRelation[] = [...(result.data as any).getLegacyJobs]
      const uniqueAdditionalJobs = excludeDuplicateJobs($jobIds.current, additionalJobs)

      $jobIds.current = [...$jobIds.current, ...getJobIds(additionalJobs)]
      $lastJobId.current = getLastJobId(additionalJobs)

      setIsLoading(false)
      setJobs([...jobs, ...uniqueAdditionalJobs])
    },
    [$lastJobId.current, jobs],
  )

  const searchJobs = debounce(async () => {
    if ($searchInput.current === null) {
      return
    }

    const query = $searchInput.current.value.trim()

    if (query.length === 0) {
      $jobIds.current = getJobIds(initialJobs)
      $lastJobId.current = getLastJobId(initialJobs)

      setJobs(initialJobs)

      return
    }

    $wasSearching.current = true

    setIsLoading(true)
    setJobs([])

    const result = await getLegacyJobsResult.fetchMore({
      variables: {
        pageLength: PAGE_LENGTH,
        query,
      },
    })

    const foundJobs: LegacyJobWithRelation[] = [...(result.data as any).getLegacyJobs]

    $jobIds.current = [...$jobIds.current, ...getJobIds(foundJobs)]
    $lastJobId.current = getLastJobId(foundJobs)

    setJobs(foundJobs)
    setIsLoading(false)
  }, 500)

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
            className="fr-btn"
            href="https://www.demarches-simplifiees.fr/commencer/metiers-numerique-gouv-fr-candidature-spontanee"
            style={{
              marginBottom: '.5rem',
              marginLeft: '2rem',
            }}
          >
            Déposez une candidature spontanée
            <i
              className="ri-file-add-line"
              style={{
                marginLeft: '0.5rem',
              }}
            />
          </a>
        </div>

        <div className="fr-grid-row fr-py-2w">
          <div className="fr-col-12 fr-col-md-12">
            <label className="fr-label" htmlFor="JobsSearchInput">
              Métier
            </label>
            <div className="fr-input-wrap fr-mt-1w fr-fi-search-line">
              <input ref={$searchInput} className="fr-input" id="JobsSearchInput" onInput={searchJobs} type="text" />
            </div>
          </div>

          {/* <div className="fr-col-12 fr-mt-2w fr-col-md-5 fr-mt-md-0 fr-pl-md-4w">
          <label className="fr-label" htmlFor="JobsRegionSelect">
            Région
          </label>
          <div className="fr-input-wrap fr-mt-1w">
            <select className="fr-select" id="JobsRegionSelect">
              <option value="">Toutes</option>
              <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
              <option value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</option>
              <option value="Bretagne">Bretagne</option>
              <option value="Centre-Val de Loire">Centre-Val de Loire</option>
              <option value="Corse">Corse</option>
              <option value="Grand Est">Grand Est</option>
              <option value="Guadeloupe">Guadeloupe</option>
              <option value="Guyane">Guyane</option>
              <option value="Hauts-de-France">Hauts-de-France</option>
              <option value="Île-de-France">Île-de-France</option>
              <option value="La Réunion">La Réunion</option>
              <option value="Martinique">Martinique</option>
              <option value="Mayotte">Mayotte</option>
              <option value="Normandie">Normandie</option>
              <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
              <option value="Occitanie">Occitanie</option>
              <option value="Pays de la Loire">Pays de la Loire</option>
              <option value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d’Azur</option>
            </select>
          </div>
        </div> */}
        </div>

        <div className="fr-grid-row">
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

        <div className="fr-py-4w" id="LoadMoreSection">
          <button className="fr-btn" disabled={isLoading} onClick={() => loadMoreJobs()} type="button">
            Afficher plus de résultats
          </button>
        </div>
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
    take: PAGE_LENGTH,
    where: {
      source: JobSource.MNN,
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
