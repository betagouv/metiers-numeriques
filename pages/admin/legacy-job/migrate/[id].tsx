import { useQuery, useMutation } from '@apollo/client'
import { AdminCard } from '@app/atoms/AdminCard'
import { AdminErrorCard, ADMIN_ERROR } from '@app/atoms/AdminErrorCard'
import AdminHeader from '@app/atoms/AdminHeader'
import { DoubleField } from '@app/atoms/DoubleField'
import { Flex } from '@app/atoms/Flex'
import { Subtitle } from '@app/atoms/Subtitle'
import Title from '@app/atoms/Title'
import { convertGeocodeJsonFeatureToPrismaAddress } from '@app/helpers/convertGeocodeJsonFeatureToPrismaAddress'
import generateKeyFromValue from '@app/helpers/generateKeyFromValue'
import { normalizeDateForDateInput } from '@app/helpers/normalizeDateForDateInput'
import { showApolloError } from '@app/helpers/showApolloError'
import { AdminForm } from '@app/molecules/AdminForm'
import queries from '@app/queries'
import { JOB_CONTRACT_TYPES_AS_OPTIONS, JOB_REMOTE_STATUSES_AS_OPTIONS, JOB_STATES_AS_OPTIONS } from '@common/constants'
import handleError from '@common/helpers/handleError'
import { JobContractType, JobRemoteStatus } from '@prisma/client'
import { Field, Select, TextInput } from '@singularity/core'
import cuid from 'cuid'
import dayjs from 'dayjs'
import ky from 'ky-universal'
import { useRouter } from 'next/router'
import { JobFormSchema } from 'pages/admin/job/[id]'
import * as R from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import slugify from 'slugify'

import type { Job, JobState, Prisma } from '@prisma/client'

type JobFormData = Omit<Prisma.JobCreateInput, 'addressId' | 'expiredAt' | 'seniorityInMonths'> & {
  addressAsPrismaAddress: Prisma.AddressCreateInput
  applicationContactIds: string[]
  contractTypes: JobContractType[]
  expiredAtAsString: string
  infoContactId: string
  professionId: string
  recruiterId: string
  seniorityInYears: number
  state: JobState
}

const extractContractType = (legacyContractType: string): JobContractType | null => {
  switch (true) {
    case /contractuel/i.test(legacyContractType):
      return JobContractType.CONTRACT_WORKER

    case /fonctionnaire/i.test(legacyContractType):
      return JobContractType.NATIONAL_CIVIL_SERVANT

    case /cdd/i.test(legacyContractType):
      return JobContractType.TEMPORARY

    case /cdi/i.test(legacyContractType):
      return JobContractType.PERMANENT

    default:
      return null
  }
}

const extractContractTypes = (legacyContractTypes: string[]): JobContractType[] =>
  R.pipe(R.map(extractContractType), R.reject(R.isNil))(legacyContractTypes) as JobContractType[]

export default function AdminLegacyJobMigratorPage() {
  const router = useRouter()
  const { id } = router.query

  const [initialLegacyValues, setInitialLegacyValues] = useState({})
  const [initialValues, setInitialValues] = useState<Partial<JobFormData>>()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNotFound, setIsNotFound] = useState(false)
  const [legacyServicesAsOptions, setLegacyServicesAsOptions] = useState<Common.App.SelectOption[]>([])

  const getLegacyJobResult = useQuery(queries.legacyJob.GET_ONE, {
    variables: {
      id: id || '',
    },
  })
  const getLegacyServicesListResult = useQuery(queries.legacyService.GET_LIST)
  const [createAddress] = useMutation(queries.address.CREATE_ONE)
  const [createJob] = useMutation(queries.job.CREATE_ONE)
  const [updateLegacyJob] = useMutation(queries.legacyJob.UPDATE_ONE)

  const goToList = () => {
    router.push('/admin/legacy-jobs')
  }

  const migrateAndGoToList = useCallback(async (values: any) => {
    try {
      setIsLoading(true)

      const newAddressResult = await createAddress({
        variables: {
          input: values.addressAsPrismaAddress,
        },
      })
      if (newAddressResult.errors) {
        throw new Error(`Cannot create address: ${JSON.stringify(values?.addressAsPrismaAddress)}.`)
      }

      const input: Partial<Job> = R.pick([
        'applicationContactIds',
        'applicationWebsiteUrl',
        'contractTypes',
        'infoContactId',
        'missionDescription',
        'missionVideoUrl',
        'particularitiesDescription',
        'perksDescription',
        'professionId',
        'processDescription',
        'profileDescription',
        'recruiterId',
        'remoteStatus',
        'salaryMax',
        'salaryMin',
        'salaryMin',
        'state',
        'tasksDescription',
        'teamDescription',
        'title',
        'updatedAt',
      ])(values)

      input.id = cuid()
      input.slug = slugify(`${input.title}-${input.id}`)
      input.addressId = newAddressResult.data.createAddress.id
      input.expiredAt = dayjs(values.expiredAtAsString).toDate()
      input.seniorityInMonths = values.seniorityInYears * 12

      const createJobResult = await createJob({
        variables: {
          input,
        },
      })

      if (createJobResult.data.createJob === null) {
        return
      }

      await updateLegacyJob({
        variables: {
          id,
          input: {
            isMigrated: true,
          },
        },
      })
      await getLegacyJobResult.refetch()

      goToList()
    } catch (err) {
      handleError(err, 'pages/admin/legacy-job/migrate/[id].tsx > migrateAndGoToList()')
    }
  }, [])

  useEffect(() => {
    if (!isLoading || isError || isNotFound || getLegacyJobResult.loading || getLegacyServicesListResult.loading) {
      return
    }

    if (getLegacyJobResult.error || getLegacyServicesListResult.error) {
      showApolloError(getLegacyJobResult.error)
      showApolloError(getLegacyServicesListResult.error)

      setIsError(true)

      return
    }

    if (getLegacyJobResult.data?.getLegacyJob === undefined) {
      setIsNotFound(true)

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

    const legacyValues = {
      ...getLegacyJobResult.data.getLegacyJob,
    }

    legacyValues.limitDate = normalizeDateForDateInput(legacyValues.limitDate)

    if (legacyValues.legacyService !== null) {
      legacyValues.legacyServiceId = legacyValues.legacyService.id
    }

    legacyValues.experiencesAsOptions = legacyValues.experiences.map(label => ({
      label,
      value: label,
    }))
    legacyValues.locationsAsOptions = legacyValues.locations.map(label => ({
      label,
      value: label,
    }))
    legacyValues.openedToContractTypesAsOptions = legacyValues.openedToContractTypes.map(label => ({
      label,
      value: label,
    }))

    setInitialLegacyValues(legacyValues)

    const newValues: Partial<JobFormData> = {}
    newValues.expiredAtAsString = normalizeDateForDateInput(legacyValues.limitDate) as string
    newValues.state = legacyValues.state
    newValues.perksDescription = legacyValues.advantages
    newValues.missionDescription = legacyValues.mission
    newValues.particularitiesDescription = legacyValues.conditions
    newValues.profileDescription = legacyValues.profile
    newValues.processDescription = legacyValues.hiringProcess
    newValues.remoteStatus = JobRemoteStatus.NONE
    newValues.seniorityInYears = 0
    newValues.tasksDescription = legacyValues.tasks
    newValues.teamDescription = legacyValues.team
    newValues.title = legacyValues.title
    newValues.updatedAt = legacyValues.updatedAt

    newValues.contractTypes = extractContractTypes(legacyValues.openedToContractTypes)

    // Async address & PEP URL extractions
    ;(async () => {
      if (legacyValues.locations.length > 0) {
        const searchParams = {
          q: legacyValues.locations[0],
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
          newValues.addressAsPrismaAddress = foundAddresses[0]
        }
      }

      setInitialValues(newValues)
      setIsLoading(false)
    })()
  }, [getLegacyJobResult.data, getLegacyServicesListResult.data])

  return (
    <>
      <AdminHeader>
        <Title>Migration d’une offre [LEGACY]</Title>
      </AdminHeader>

      {isNotFound && <AdminErrorCard error={ADMIN_ERROR.NOT_FOUND} />}
      {isError && <AdminErrorCard error={ADMIN_ERROR.GRAPHQL_REQUEST} />}

      <Flex>
        <Flex
          style={{
            flexGrow: 0.5,
            width: '50%',
          }}
        >
          <AdminForm
            key={generateKeyFromValue(initialLegacyValues)}
            initialValues={initialLegacyValues}
            onSubmit={() => undefined}
          >
            <AdminCard isFirst>
              <Subtitle>Anciens champs</Subtitle>

              {/* <Field>
              <AdminForm.TextInput isDisabled label="Référence interne" name="reference" />
            </Field> */}

              {/* <Field>
              <AdminForm.TextInput isDisabled label="Slug" name="slug" />
            </Field> */}

              <Field>
                <AdminForm.TextInput isDisabled label="Intitulé *" name="title" />
              </Field>

              <DoubleField>
                <AdminForm.Select isDisabled label="État *" name="state" options={JOB_STATES_AS_OPTIONS} />

                <AdminForm.TextInput isDisabled label="Expire le *" name="limitDate" type="date" />
              </DoubleField>

              <DoubleField>
                <AdminForm.Select
                  isDisabled
                  label="Service (entité recruteuse)"
                  name="legacyServiceId"
                  options={legacyServicesAsOptions}
                />

                <Select
                  key={generateKeyFromValue((initialLegacyValues as any).openedToContractTypesAsOptions)}
                  defaultValue={(initialLegacyValues as any).openedToContractTypesAsOptions}
                  isDisabled
                  isMulti
                  label="Ouvert aux"
                />
              </DoubleField>

              <DoubleField>
                <Select isDisabled isMulti label="Expérience" name="experiencesAsOptions" />

                <TextInput disabled label="&nbsp;" style={{ opacity: 0.1 }} />
              </DoubleField>

              <DoubleField>
                <TextInput disabled label="&nbsp;" style={{ opacity: 0.1 }} />

                <TextInput disabled label="&nbsp;" style={{ opacity: 0.1 }} />
              </DoubleField>

              <Field>
                <Select
                  key={generateKeyFromValue((initialLegacyValues as any).locationsAsOptions)}
                  defaultValue={(initialLegacyValues as any).locationsAsOptions}
                  isDisabled
                  isMulti
                  label="Localisations"
                />
              </Field>

              <Field>
                <AdminForm.TextInput isDisabled label="Salaire" name="salary" />
              </Field>

              <Field>
                <AdminForm.Textarea isDisabled label="Mission" name="mission" />
              </Field>
            </AdminCard>

            <AdminCard>
              <Field>
                <AdminForm.Textarea isDisabled label="Si vous avez des questions" name="teamInfo" />
              </Field>

              <Field>
                <AdminForm.Textarea isDisabled label="Pour candidater" name="toApply" />
              </Field>
            </AdminCard>

            <AdminCard>
              {/* <Field>
              <AdminForm.Textarea isDisabled label="Équipe" name="team" />
            </Field> */}

              {/* <Field>
              <AdminForm.Textarea isDisabled label="Ce que vous ferez" name="tasks" />
            </Field> */}

              {/* <Field>
              <AdminForm.Textarea isDisabled label="Les plus du poste" name="advantages" />
            </Field> */}

              {/* <Field>
              <AdminForm.Textarea isDisabled label="Conditions particulière du poste" name="conditions" />
            </Field> */}

              {/* <Field>
              <AdminForm.Textarea isDisabled label="Votre profil" name="profile" />
            </Field> */}

              {/* <Separator /> */}

              <Field>
                <AdminForm.Textarea isDisabled label="Pour en savoir plus" name="more" />
              </Field>

              <Field>
                <AdminForm.Textarea isDisabled label="Processus de recrutement" name="hiringProcess" />
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
            key={generateKeyFromValue(initialValues)}
            initialValues={initialValues || {}}
            onSubmit={migrateAndGoToList}
            validationSchema={JobFormSchema}
          >
            <AdminCard isFirst>
              <Subtitle>Nouveaux champs</Subtitle>

              <Field>
                <AdminForm.TextInput isDisabled={isLoading} label="Intitulé *" name="title" />
              </Field>

              <DoubleField>
                <AdminForm.Select
                  isDisabled={isLoading}
                  label="État *"
                  name="state"
                  options={JOB_STATES_AS_OPTIONS}
                  placeholder="…"
                />

                <AdminForm.TextInput isDisabled={isLoading} label="Expire le *" name="expiredAtAsString" type="date" />
              </DoubleField>

              <DoubleField>
                <AdminForm.RecruiterSelect
                  isDisabled={isLoading}
                  label="Recruteur *"
                  name="recruiterId"
                  placeholder="…"
                />

                <AdminForm.Select
                  isDisabled={isLoading}
                  isMulti
                  label="Types de contrat *"
                  name="contractTypes"
                  options={JOB_CONTRACT_TYPES_AS_OPTIONS}
                  placeholder="…"
                />
              </DoubleField>

              <DoubleField>
                <AdminForm.TextInput
                  isDisabled={isLoading}
                  label="Années d’expérience (0 si débutant·e) *"
                  name="seniorityInYears"
                  type="number"
                />

                <AdminForm.Select
                  isDisabled={isLoading}
                  label="Télétravail possible *"
                  name="remoteStatus"
                  options={JOB_REMOTE_STATUSES_AS_OPTIONS}
                  placeholder="…"
                />
              </DoubleField>

              <DoubleField>
                <AdminForm.ProfessionSelect
                  isDisabled={isLoading}
                  label="Métier *"
                  name="professionId"
                  placeholder="…"
                />

                <AdminForm.Select isDisabled label="Étiquettes *" name="tagIds" options={[]} placeholder="…" />
              </DoubleField>

              <Field>
                <AdminForm.AddressSelect isDisabled={isLoading} label="Adresse *" name="addressAsPrismaAddress" />
              </Field>

              <DoubleField>
                <AdminForm.TextInput
                  isDisabled={isLoading}
                  label="Rémunération minimum (annuelle brute)"
                  name="salaryMin"
                  type="number"
                />

                <AdminForm.TextInput
                  isDisabled={isLoading}
                  label="Rémunération maximum (annuelle brute)"
                  name="salaryMax"
                  type="number"
                />
              </DoubleField>

              <Field>
                <AdminForm.Textarea
                  isDisabled={isLoading}
                  label="Mission *"
                  name="missionDescription"
                  placeholder="Décrivez la mission de la manière la plus succinte possible."
                />
              </Field>
            </AdminCard>

            <AdminCard>
              <Field>
                <AdminForm.ContactSelect
                  isDisabled={isLoading}
                  label="Contact unique pour les questions *"
                  name="infoContactId"
                  placeholder="…"
                />
              </Field>

              <Field>
                <AdminForm.ContactSelect
                  isDisabled={isLoading}
                  isMulti
                  label="Contacts pour l’envoi des candidatures **"
                  name="applicationContactIds"
                  placeholder="…"
                />
              </Field>

              <Field>
                <AdminForm.TextInput
                  isDisabled={isLoading}
                  label="ou site officiel de candidure (URL) **"
                  name="applicationWebsiteUrl"
                  type="url"
                />
              </Field>
            </AdminCard>

            <AdminCard>
              <Field>
                <AdminForm.Textarea
                  isDisabled={isLoading}
                  label="L'équipe"
                  name="teamDescription"
                  placeholder="Brève description des rôles et objectifs de l’équipe."
                />
              </Field>

              <Field>
                <AdminForm.Textarea
                  isDisabled={isLoading}
                  label="Avantages"
                  name="perksDescription"
                  placeholder="Liste des avantages du poste : opportunités de formation, horaires aménagées, etc."
                />
              </Field>
            </AdminCard>

            <AdminCard>
              <Field>
                <AdminForm.Textarea
                  isDisabled={isLoading}
                  label="Profil idéal de candidat·e"
                  name="profileDescription"
                  placeholder="Liste des expériences, qualités et éventuelles qualifications attendues."
                />
              </Field>

              <Field>
                <AdminForm.Textarea
                  isDisabled={isLoading}
                  label="Tâches"
                  name="tasksDescription"
                  placeholder="Liste des tâches principales impliquées par le poste."
                />
              </Field>

              <Field>
                <AdminForm.Textarea
                  isDisabled={isLoading}
                  label="Conditions particulières"
                  name="particularitiesDescription"
                  placeholder="Conditions particulières du poste : formations, habilitations, etc."
                />
              </Field>

              <Field>
                <AdminForm.TextInput
                  isDisabled={isLoading}
                  label="Processus de recrutement"
                  name="processDescription"
                  placeholder="En une seule phrase si possible."
                />
              </Field>
            </AdminCard>

            <AdminCard>
              <AdminForm.Cancel isDisabled={isLoading} onClick={goToList}>
                Annuler
              </AdminForm.Cancel>
              <AdminForm.Submit isDisabled={isLoading}>Migrer</AdminForm.Submit>
            </AdminCard>
          </AdminForm>
        </Flex>
      </Flex>
    </>
  )
}
