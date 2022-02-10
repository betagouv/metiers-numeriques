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
import { normalizeDateForDateTimeInput } from '@app/helpers/normalizeDateForDateTimeInput'
import { showApolloError } from '@app/helpers/showApolloError'
import { Form } from '@app/molecules/Form'
import queries from '@app/queries'
import { JOB_CONTRACT_TYPES_AS_OPTIONS, JOB_REMOTE_STATUSES_AS_OPTIONS, JOB_STATES_AS_OPTIONS } from '@common/constants'
import handleError from '@common/helpers/handleError'
import { Job, JobContractType, JobRemoteStatus, JobState, Prisma } from '@prisma/client'
import { Field, Select, TextInput } from '@singularity/core'
import cuid from 'cuid'
import dayjs from 'dayjs'
import ky from 'ky-universal'
import { useAuth } from 'nexauth'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import slugify from 'slugify'
import * as Yup from 'yup'

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

const getFormSchema = (accessToken?: string) =>
  Yup.object().shape({
    addressAsPrismaAddress: Yup.object().required(`L’adresse est obligatoire.`),
    applicationContactIds: Yup.array(Yup.string().nullable())
      .required(`Au moins un contact "candidatures" est obligatoire.`)
      .min(1, `Au moins un contact "candidatures" est obligatoire.`),
    contractTypes: Yup.array(Yup.string().nullable())
      .required(`Au moins un type de contrat est obligatoire.`)
      .min(1, `Au moins un type de contrat est obligatoire.`),
    expiredAtAsString: Yup.string().required(`La date d’expiration est obligatoire.`),
    infoContactId: Yup.string().required(`Le contact "questions" est obligatoire.`),
    missionDescription: Yup.string().required(`Décrire la mission est obligatoire.`),
    pepUrl: Yup.string()
      .nullable()
      .url(`Cette URL est mal formatée.`)
      .test('is2XX', 'Cette URL PEP renvoie vers une page introuvable.', async value => {
        try {
          if (value === undefined || value === null) {
            return true
          }

          const res = (await ky
            .get('/api/pep', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              searchParams: {
                url: value,
              },
            })
            .json()) as Common.Api.ResponseBody<{
            isValid: boolean
          }>

          if (res.hasError === false && res.data.isValid) {
            return true
          }

          return false
        } catch (err) {
          handleError(err, 'pages/admin/legacy-jobs/migrate/[id].tsx > FormSchema')

          return false
        }
      }),
    professionId: Yup.string().required(`Le métier est obligatoire.`),
    recruiterId: Yup.string().required(`Le recruteur est obligatoire.`),
    remoteStatus: Yup.string().required(`Indiquer les possibilités de télétravail est obligatoire.`),
    seniorityInYears: Yup.number().required(`Le nombre d’années d’expérience requises est obligatoire.`),
    state: Yup.string().required(`L’état est obligatoire.`),
    title: Yup.string().required(`L’intitulé est obligatoire.`),
  })

export default function LegacyJobEditorPage() {
  const router = useRouter()
  const { id } = router.query

  const [initialLegacyValues, setInitialLegacyValues] = useState({})
  const [initialValues, setInitialValues] = useState<Partial<JobFormData>>()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNotFound, setIsNotFound] = useState(false)
  const [legacyServicesAsOptions, setLegacyServicesAsOptions] = useState<Common.App.SelectOption[]>([])
  const auth = useAuth()

  const getLegacyJobResult = useQuery(queries.legacyJob.GET_ONE, {
    variables: {
      id: id || '',
    },
  })
  const getLegacyServicesListResult = useQuery(queries.legacyService.GET_LIST)
  const [createAddress] = useMutation(queries.address.CREATE_ONE)
  const [createJob] = useMutation(queries.job.CREATE_ONE)
  const [updateLegacyJob] = useMutation(queries.legacyJob.UPDATE_ONE)

  const FormSchema = useMemo(() => getFormSchema(auth.state.accessToken), [auth.state])

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
        'contractTypes',
        'infoContactId',
        'missionDescription',
        'missionVideoUrl',
        'particularitiesDescription',
        'pepUrl',
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
    legacyValues.updatedAt = normalizeDateForDateTimeInput(legacyValues.updatedAt)

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

      if (typeof legacyValues.more === 'string') {
        const maybePepUrlResult = /"(https:\/\/place-emploi-public\.gouv\.fr\/[^"]+)"/.exec(legacyValues.more)
        if (maybePepUrlResult !== null) {
          const searchParams = {
            url: maybePepUrlResult[1],
          }
          const url = `/api/pep`
          const res = (await ky
            .get(url, {
              headers: {
                Authorization: `Bearer ${auth.state.accessToken}`,
              },
              searchParams,
            })
            .json()) as Common.Api.ResponseBody<{
            isValid: boolean
          }>

          if (res.hasError === false && res.data.isValid) {
            // eslint-disable-next-line prefer-destructuring
            newValues.pepUrl = maybePepUrlResult[1]
          }
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
          <Form
            key={generateKeyFromValue(initialLegacyValues)}
            initialValues={initialLegacyValues}
            onSubmit={() => undefined}
          >
            <AdminCard isFirst>
              <Subtitle>Anciens champs</Subtitle>

              {/* <Field>
              <Form.TextInput isDisabled label="Référence interne" name="reference" />
            </Field> */}

              {/* <Field>
              <Form.TextInput isDisabled label="Slug" name="slug" />
            </Field> */}

              <Field>
                <Form.TextInput isDisabled label="Intitulé *" name="title" />
              </Field>

              <DoubleField>
                <Form.Select isDisabled label="État *" name="state" options={JOB_STATES_AS_OPTIONS} />

                <Form.TextInput isDisabled label="Expire le *" name="limitDate" type="date" />
              </DoubleField>

              <DoubleField>
                <Form.Select
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
                <Form.TextInput isDisabled label="Salaire" name="salary" />
              </Field>

              <Field>
                <Form.Textarea isDisabled label="Mission" name="mission" />
              </Field>
            </AdminCard>

            <AdminCard>
              <Field>
                <Form.Textarea isDisabled label="Si vous avez des questions" name="teamInfo" />
              </Field>

              <Field>
                <Form.Textarea isDisabled label="Pour candidater" name="toApply" />
              </Field>
            </AdminCard>

            <AdminCard>
              {/* <Field>
              <Form.Textarea isDisabled label="Équipe" name="team" />
            </Field> */}

              {/* <Field>
              <Form.Textarea isDisabled label="Ce que vous ferez" name="tasks" />
            </Field> */}

              {/* <Field>
              <Form.Textarea isDisabled label="Les plus du poste" name="advantages" />
            </Field> */}

              {/* <Field>
              <Form.Textarea isDisabled label="Conditions particulière du poste" name="conditions" />
            </Field> */}

              {/* <Field>
              <Form.Textarea isDisabled label="Votre profil" name="profile" />
            </Field> */}

              {/* <Separator /> */}

              <Field>
                <Form.Textarea isDisabled label="Pour en savoir plus" name="more" />
              </Field>

              <Field>
                <Form.Textarea isDisabled label="Processus de recrutement" name="hiringProcess" />
              </Field>
            </AdminCard>
          </Form>
        </Flex>

        <Flex
          style={{
            flexDirection: 'column',
            flexGrow: 0.5,
            width: '50%',
          }}
        >
          <Form
            key={generateKeyFromValue(initialValues)}
            initialValues={initialValues || {}}
            onSubmit={migrateAndGoToList}
            validationSchema={FormSchema}
          >
            <AdminCard isFirst>
              <Subtitle>Nouveaux champs</Subtitle>

              <Field>
                <Form.TextInput isDisabled={isLoading} label="Intitulé *" name="title" />
              </Field>

              <DoubleField>
                <Form.Select
                  isDisabled={isLoading}
                  label="État *"
                  name="state"
                  options={JOB_STATES_AS_OPTIONS}
                  placeholder="…"
                />

                <Form.TextInput isDisabled={isLoading} label="Expire le *" name="expiredAtAsString" type="date" />
              </DoubleField>

              <DoubleField>
                <Form.RecruiterSelect isDisabled={isLoading} label="Recruteur *" name="recruiterId" placeholder="…" />

                <Form.Select
                  isDisabled={isLoading}
                  isMulti
                  label="Types de contrat *"
                  name="contractTypes"
                  options={JOB_CONTRACT_TYPES_AS_OPTIONS}
                  placeholder="…"
                />
              </DoubleField>

              <DoubleField>
                <Form.TextInput
                  isDisabled={isLoading}
                  label="Années d’expérience (0 si débutant·e) *"
                  name="seniorityInYears"
                  type="number"
                />

                <Form.Select
                  isDisabled={isLoading}
                  label="Télétravail possible *"
                  name="remoteStatus"
                  options={JOB_REMOTE_STATUSES_AS_OPTIONS}
                  placeholder="…"
                />
              </DoubleField>

              <DoubleField>
                <Form.ProfessionSelect isDisabled={isLoading} label="Métier *" name="professionId" placeholder="…" />

                <Form.Select isDisabled label="Étiquettes *" name="tagIds" options={[]} placeholder="…" />
              </DoubleField>

              <Field>
                <Form.AddressSelect isDisabled={isLoading} label="Adresse *" name="addressAsPrismaAddress" />
              </Field>

              <DoubleField>
                <Form.TextInput
                  isDisabled={isLoading}
                  label="Rémunération minimum (annuelle brute)"
                  name="salaryMin"
                  type="number"
                />

                <Form.TextInput
                  isDisabled={isLoading}
                  label="Rémunération maximum (annuelle brute)"
                  name="salaryMax"
                  type="number"
                />
              </DoubleField>

              <Field>
                <Form.Textarea
                  isDisabled={isLoading}
                  label="Mission *"
                  name="missionDescription"
                  placeholder="Décrivez la mission de la manière la plus succinte possible."
                />
              </Field>
            </AdminCard>

            <AdminCard>
              <Field>
                <Form.ContactSelect
                  isDisabled={isLoading}
                  label="Contact unique pour les questions *"
                  name="infoContactId"
                  placeholder="…"
                />
              </Field>

              <Field>
                <Form.ContactSelect
                  isDisabled={isLoading}
                  isMulti
                  label="Contacts pour l’envoi des candidatures *"
                  name="applicationContactIds"
                  placeholder="…"
                />
              </Field>
            </AdminCard>

            <AdminCard>
              <Field>
                <Form.Textarea
                  isDisabled={isLoading}
                  label="L'équipe"
                  name="teamDescription"
                  placeholder="Brève description des rôles et objectifs de l’équipe."
                />
              </Field>

              <Field>
                <Form.Textarea
                  isDisabled={isLoading}
                  label="Avantages"
                  name="perksDescription"
                  placeholder="Liste des avantages du poste : opportunités de formation, horaires aménagées, etc."
                />
              </Field>
            </AdminCard>

            <AdminCard>
              <Field>
                <Form.Textarea
                  isDisabled={isLoading}
                  label="Profil idéal de candidat·e"
                  name="profileDescription"
                  placeholder="Liste des expériences, qualités et éventuelles qualifications attendues."
                />
              </Field>

              <Field>
                <Form.Textarea
                  isDisabled={isLoading}
                  label="Tâches"
                  name="tasksDescription"
                  placeholder="Liste des tâches principales impliquées par le poste."
                />
              </Field>

              <Field>
                <Form.Textarea
                  isDisabled={isLoading}
                  label="Conditions particulières"
                  name="particularitiesDescription"
                  placeholder="Conditions particulières du poste : formations, habilitations, etc."
                />
              </Field>

              <Field>
                <Form.TextInput
                  isDisabled={isLoading}
                  label="Processus de recrutement"
                  name="processDescription"
                  placeholder="En une seule phrase si possible."
                />
              </Field>

              <Field>
                <Form.TextInput
                  isDisabled={isLoading}
                  label="Lien PEP (URL)"
                  name="pepUrl"
                  placeholder="https://place-emploi-public.gouv.fr/offre-emploi/…"
                />
              </Field>
            </AdminCard>

            <AdminCard>
              <Form.Cancel isDisabled={isLoading} onClick={goToList}>
                Annuler
              </Form.Cancel>
              <Form.Submit isDisabled={isLoading}>Migrer</Form.Submit>
            </AdminCard>
          </Form>
        </Flex>
      </Flex>
    </>
  )
}
