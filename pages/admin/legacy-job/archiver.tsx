import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { AdminCard } from '@app/atoms/AdminCard'
import AdminHeader from '@app/atoms/AdminHeader'
import { DoubleField } from '@app/atoms/DoubleField'
import { Flex } from '@app/atoms/Flex'
import { Subtitle } from '@app/atoms/Subtitle'
import Title from '@app/atoms/Title'
import { convertGeocodeJsonFeatureToPrismaAddress } from '@app/helpers/convertGeocodeJsonFeatureToPrismaAddress'
import { generateKeyFromValues } from '@app/helpers/generateKeyFromValues'
import { normalizeDateForDateInput } from '@app/helpers/normalizeDateForDateInput'
import { AdminForm } from '@app/molecules/AdminForm'
import queries from '@app/queries'
import { JOB_SOURCES_AS_OPTIONS, REGION, REGIONS_AS_OPTIONS } from '@common/constants'
import handleError from '@common/helpers/handleError'
import { JobSource } from '@prisma/client'
import { Field, Select } from '@singularity/core'
import cuid from 'cuid'
import dayjs from 'dayjs'
import ky from 'ky'
import * as R from 'ramda'
import { useCallback, useEffect, useRef, useState } from 'react'
import slugify from 'slugify'

import { ArchivedFormSchema } from '../archived-job/[id]'

import type { Job, Prisma } from '@prisma/client'

type JobFormData = Omit<Prisma.ArchivedJobCreateInput, 'expiredAt'> & {
  expiredAtAsString: string
  professionId: string
}

const cleanMarkdown = (dirtySource: string | null): string | undefined => {
  if (dirtySource === null) {
    return undefined
  }

  const cleanSource = dirtySource
    .replace(/[\f\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/g, ' ')
    .replace(/ {2,}/g, ' ')
    .replace(/(^ | $)+/gm, '')
    .replace(/(^)[•.][\s]*/gm, '$1- ')
    .replace(/\n\n-/g, '\n-')
    .replace(/(^\d+)[\s-]*/gm, '$1. ')
    .replace(/^(.*)[.,]$/gm, '\n$1.\n')
    .replace(/([^ ]):/g, '$1 :')
    .replace(/([a-z0-9âàäéêèëîïôöûùüœ:])\n([a-z0-9âàäéêèëîïôöûùüœ](?!\.))/g, '$1 $2')
    .replace(/\n{2,}/g, '\n\n')
    .replace(/([^\n])\n(\d+\. |- )/g, '$1\n\n$2')
    .trim()

  if (cleanSource.length === 0) {
    return undefined
  }

  return cleanSource
}

const guessProfession = (professionsAsOptions: Common.App.SelectOption[], title: string): string | undefined => {
  let foundProfessionAsOption: Common.App.SelectOption | undefined

  switch (true) {
    case /s[eé]cu/i.test(title):
      foundProfessionAsOption = professionsAsOptions.find(({ label }) => label === 'Sécurité')
      break

    case /admin(istrat).*sys/i.test(title):
      foundProfessionAsOption = professionsAsOptions.find(({ label }) => label === 'Infrastructure')
      break

    case /r[ée]seau|t[ée]l[ée]com/i.test(title):
      foundProfessionAsOption = professionsAsOptions.find(({ label }) => label === 'Réseau & Télécom')
      break

    case /archi/i.test(title):
      foundProfessionAsOption = professionsAsOptions.find(({ label }) => label === 'Architecture')
      break

    case /support/i.test(title):
      foundProfessionAsOption = professionsAsOptions.find(({ label }) => label === 'Support')
      break

    case /d[eé]vel|programmeu/i.test(title):
      foundProfessionAsOption = professionsAsOptions.find(({ label }) => label === 'Développement')
      break

    case /maintenance|usager|utilisateur/i.test(title):
      foundProfessionAsOption = professionsAsOptions.find(({ label }) => label === 'Support')
      break

    case /sys.*info/i.test(title):
      foundProfessionAsOption = professionsAsOptions.find(({ label }) => label === 'Infrastructure')
      break

    case / data$|^data | data |donn[eé]e/i.test(title):
      foundProfessionAsOption = professionsAsOptions.find(({ label }) => label === 'Données')
      break

    case /product|produit|project|projet/i.test(title):
      foundProfessionAsOption = professionsAsOptions.find(({ label }) => label === 'Projet / Produit')
      break

    default:
      foundProfessionAsOption = professionsAsOptions.find(({ label }) => label === 'Autres')
  }

  if (foundProfessionAsOption === undefined) {
    return undefined
  }

  return foundProfessionAsOption.value
}

export default function AdminLegacyJobMigratorPage() {
  const $currentLegacyJobId = useRef()
  const $professionsAsOptions = useRef<Common.App.SelectOption[]>([])
  const [oldInitialValues, setOldInitialValues] = useState({})
  const [newInitialValues, setNewInitialValues] = useState<Partial<JobFormData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [legacyServicesAsOptions, setLegacyServicesAsOptions] = useState<Common.App.SelectOption[]>([])

  const [getLegacyJob] = useLazyQuery(queries.legacyJob.GET_ONE)
  const getLegacyJobsResult = useQuery(queries.legacyJob.GET_ALL, {
    variables: {
      pageIndex: 0,
      perPage: 1,
      source: JobSource.PEP,
    },
  })
  const getLegacyServicesListResult = useQuery(queries.legacyService.GET_LIST)
  const getProfessionsListResult = useQuery(queries.profession.GET_LIST)
  const [createArchivedJob] = useMutation(queries.archivedJob.CREATE_ONE)
  const [updateLegacyJob] = useMutation(queries.legacyJob.UPDATE_ONE)

  const migrateAndLoadNextEntry = useCallback(async (values: any) => {
    try {
      setIsLoading(true)

      const input: Partial<Job> = R.pick([
        'missionDescription',
        'professionId',
        'profileDescription',
        'recruiterName',
        'region',
        'source',
        'sourceId',
        'title',
      ])(values)

      input.id = cuid()
      input.slug = slugify(`${input.title}-${input.id}`)
      input.expiredAt = dayjs(values.expiredAtAsString).toDate()

      const createArchivedJobResult = await createArchivedJob({
        variables: {
          input,
        },
      })

      if (createArchivedJobResult.data.createArchivedJob === null) {
        return
      }

      await updateLegacyJob({
        variables: {
          id: $currentLegacyJobId.current,
          input: {
            isMigrated: true,
          },
        },
      })
      await getLegacyJobsResult.refetch()

      setIsLoading(true)
    } catch (err) {
      handleError(err, 'pages/admin/legacy-job/archiver.tsx > migrateAndLoadNextEntry()')
    }
  }, [])

  useEffect(() => {
    if (
      !isLoading ||
      getLegacyJobsResult.loading ||
      getLegacyServicesListResult.loading ||
      getProfessionsListResult.loading
    ) {
      return
    }

    if (legacyServicesAsOptions.length === 0) {
      const newLegacyServicesAsOptions = R.pipe(
        R.sortBy(R.prop('name')) as any,
        R.map(({ id, legacyEntity, name }) => ({
          label: legacyEntity ? `${name} (${legacyEntity.name})` : name,
          value: id,
        })),
      )(getLegacyServicesListResult.data.getLegacyServicesList)

      setLegacyServicesAsOptions(newLegacyServicesAsOptions)
    }

    if ($professionsAsOptions.current.length === 0) {
      $professionsAsOptions.current = R.map(({ id, name }) => ({
        label: name,
        value: id,
      }))(getProfessionsListResult.data.getProfessionsList)
    }

    ;(async () => {
      const legacyJobId = getLegacyJobsResult.data.getLegacyJobs.data[0].id
      const getLegacyJobResult = await getLegacyJob({
        variables: {
          id: legacyJobId,
        },
      })

      const oldInitialValues = {
        ...getLegacyJobResult.data.getLegacyJob,
      }

      oldInitialValues.limitDate = normalizeDateForDateInput(oldInitialValues.limitDate)

      if (oldInitialValues.legacyService !== null) {
        oldInitialValues.legacyServiceId = oldInitialValues.legacyService.id
      }

      oldInitialValues.departmentsAsOptions = oldInitialValues.department.map(label => ({
        label,
        value: label,
      }))

      oldInitialValues.locationsAsOptions = oldInitialValues.locations.map(label => ({
        label,
        value: label,
      }))

      $currentLegacyJobId.current = legacyJobId
      setOldInitialValues(oldInitialValues)

      const newInitialValues: Partial<JobFormData> = {}
      newInitialValues.expiredAtAsString = normalizeDateForDateInput(oldInitialValues.limitDate) as string
      newInitialValues.missionDescription = cleanMarkdown(oldInitialValues.mission)
      newInitialValues.profileDescription = cleanMarkdown(oldInitialValues.profile)
      newInitialValues.source = oldInitialValues.source
      newInitialValues.sourceId = oldInitialValues.reference
      newInitialValues.title = oldInitialValues.title.trim()

      if (newInitialValues.expiredAtAsString === null) {
        newInitialValues.expiredAtAsString = dayjs().format('YYYY-MM-DD')
      }

      newInitialValues.professionId = guessProfession($professionsAsOptions.current, newInitialValues.title as string)

      if (oldInitialValues.legacyService !== null) {
        newInitialValues.recruiterName = oldInitialValues.legacyService.name.trim()
      } else if (oldInitialValues.department.length > 0) {
        newInitialValues.recruiterName = oldInitialValues.department.join(' ').trim()
      }

      if (oldInitialValues.locations.length > 0 && oldInitialValues.locations.join(' ').trim().length > 0) {
        const searchParams = {
          q: oldInitialValues.locations.join(' ').trim(),
        }
        const url = `https://api-adresse.data.gouv.fr/search/`
        const res: Common.GeocodeJson = await ky
          .get(url, {
            searchParams,
          })
          .json()

        if (Array.isArray(res.features) && res.features.length > 0) {
          const foundAddresses = res.features.reduce((foundAddresses: Prisma.AddressCreateInput[], feature) => {
            const prismaAddress = convertGeocodeJsonFeatureToPrismaAddress(feature)
            if (prismaAddress === undefined) {
              return foundAddresses
            }

            return [...foundAddresses, prismaAddress]
          }, [])

          // eslint-disable-next-line prefer-destructuring
          newInitialValues.region = foundAddresses[0].region
        }
      }

      if (newInitialValues.region === undefined) {
        newInitialValues.region = REGION['Île-de-France']
      }

      setNewInitialValues(newInitialValues)
      setIsLoading(false)
    })()
  }, [getLegacyJobsResult.data, getLegacyServicesListResult.data, getProfessionsListResult.data])

  return (
    <>
      <AdminHeader>
        <Title>Migration d’une offre [LEGACY]</Title>
      </AdminHeader>

      <Flex>
        <Flex
          style={{
            flexGrow: 0.5,
            width: '50%',
          }}
        >
          <AdminForm
            key={generateKeyFromValues(oldInitialValues)}
            initialValues={oldInitialValues}
            onSubmit={() => undefined}
          >
            <AdminCard isFirst>
              <Subtitle>Anciens champs</Subtitle>

              <Field>
                <AdminForm.TextInput isDisabled label="Référence interne" name="reference" />
              </Field>

              <Field>
                <AdminForm.TextInput isDisabled label="Intitulé *" name="title" />
              </Field>

              <Field>
                <AdminForm.TextInput isDisabled label="Expire le *" name="limitDate" type="date" />
              </Field>

              <DoubleField>
                <AdminForm.Select
                  isDisabled
                  label="Service (entité recruteuse)"
                  name="legacyServiceId"
                  options={legacyServicesAsOptions}
                />

                <Select
                  key={generateKeyFromValues((oldInitialValues as any).departmentsAsOptions)}
                  defaultValue={(oldInitialValues as any).departmentsAsOptions}
                  isDisabled
                  isMulti
                  label="departments"
                />
              </DoubleField>

              <Field>
                <Select
                  key={generateKeyFromValues((oldInitialValues as any).locationsAsOptions)}
                  defaultValue={(oldInitialValues as any).locationsAsOptions}
                  isDisabled
                  isMulti
                  label="localisations"
                />
              </Field>

              <Field>
                <AdminForm.Textarea isAutoResizing={false} isDisabled label="Misson" name="mission" />
              </Field>

              <Field>
                <AdminForm.Textarea isAutoResizing={false} isDisabled label="Profil" name="profile" />
              </Field>
            </AdminCard>
          </AdminForm>
        </Flex>

        <Flex
          style={{
            flexDirection: 'column',
            flexGrow: 0.5,
            width: '50%',
          }}
        >
          <AdminForm
            key={generateKeyFromValues(newInitialValues)}
            initialValues={newInitialValues}
            onSubmit={migrateAndLoadNextEntry}
            validationSchema={ArchivedFormSchema}
          >
            <AdminCard isFirst>
              <Subtitle>Nouveaux champs</Subtitle>

              <Field>
                <AdminForm.Select
                  isDisabled={isLoading}
                  label="Source *"
                  name="source"
                  options={JOB_SOURCES_AS_OPTIONS}
                />
              </Field>

              <Field>
                <AdminForm.TextInput isDisabled={isLoading} label="Intitulé *" name="title" />
              </Field>

              <Field>
                <AdminForm.TextInput isDisabled={isLoading} label="Expire le *" name="expiredAtAsString" type="date" />
              </Field>

              <Field>
                <AdminForm.TextInput isDisabled={isLoading} label="Recruteur *" name="recruiterName" />
              </Field>

              <Field>
                <AdminForm.ProfessionSelect
                  key={newInitialValues.professionId}
                  isDisabled={isLoading}
                  label="Métier *"
                  name="professionId"
                  placeholder="…"
                />
              </Field>

              <Field>
                <AdminForm.Select isDisabled={isLoading} label="Région *" name="region" options={REGIONS_AS_OPTIONS} />
              </Field>

              <Field>
                <AdminForm.Textarea
                  isAutoResizing={false}
                  isDisabled={isLoading}
                  label="Mission *"
                  name="missionDescription"
                  placeholder="Décrivez la mission de la manière la plus succinte possible."
                />
              </Field>

              <Field>
                <AdminForm.Textarea
                  isAutoResizing={false}
                  isDisabled={isLoading}
                  label="Profil"
                  name="profileDescription"
                  placeholder="Liste des expériences, qualités et éventuelles qualifications attendues."
                />
              </Field>
            </AdminCard>

            <AdminCard>
              <AdminForm.Submit isDisabled={isLoading}>Migrer</AdminForm.Submit>
            </AdminCard>
          </AdminForm>
        </Flex>
      </Flex>
    </>
  )
}
