import { useQuery, useMutation } from '@apollo/client'
import { AdminCard } from '@app/atoms/AdminCard'
import { AdminErrorCard, ADMIN_ERROR } from '@app/atoms/AdminErrorCard'
import AdminHeader from '@app/atoms/AdminHeader'
import { DoubleField } from '@app/atoms/DoubleField'
import { SeparatorText } from '@app/atoms/SeparatorText'
import { Subtitle } from '@app/atoms/Subtitle'
import Title from '@app/atoms/Title'
import { normalizeDateForDateInput } from '@app/helpers/normalizeDateForDateInput'
import { showApolloError } from '@app/helpers/showApolloError'
import { AdminForm } from '@app/molecules/AdminForm'
import queries from '@app/queries'
import { JOB_CONTRACT_TYPES_AS_OPTIONS, JOB_REMOTE_STATUSES_AS_OPTIONS, JOB_STATES_AS_OPTIONS } from '@common/constants'
import handleError from '@common/helpers/handleError'
import { JobState, UserRole } from '@prisma/client'
import { Field } from '@singularity/core'
import cuid from 'cuid'
import dayjs from 'dayjs'
import { useAuth } from 'nexauth/client'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import slugify from 'slugify'
import * as Yup from 'yup'

import type { JobFromGetOne } from '@api/resolvers/jobs'
import type { MutationFunctionOptions } from '@apollo/client'
import type { Job, JobContractType, Prisma } from '@prisma/client'

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

export const JobFormSchema = Yup.object().shape(
  {
    addressAsPrismaAddress: Yup.object().required(`L’adresse est obligatoire.`),
    applicationContactIds: Yup.array().when('applicationWebsiteUrl', {
      is: (applicationWebsiteUrl?: string | null) =>
        !applicationWebsiteUrl || applicationWebsiteUrl.trim().length === 0,
      otherwise: Yup.array(Yup.string().nullable()),
      then: Yup.array(Yup.string().nullable())
        .required(`Au moins un contact "candidatures" est obligatoire si le site de candidature n’est pas renseigné.`)
        .min(1, `Au moins un contact "candidatures" est obligatoire si le site de candidature n’est pas renseigné.`),
    }),
    applicationWebsiteUrl: Yup.string().when('applicationContactIds', {
      is: (applicationContactIds?: string[] | null) => !applicationContactIds || applicationContactIds.length === 0,
      otherwise: Yup.string().nullable(),
      then: Yup.string()
        .required(`Le site de candidature est obligatoire si aucun contact "candidatures" n’est renseigné.`)
        .url(`Cette URL est mal formatée.`),
    }),
    contractTypes: Yup.array(Yup.string().nullable())
      .required(`Au moins un type de contrat est obligatoire.`)
      .min(1, `Au moins un type de contrat est obligatoire.`),
    expiredAtAsString: Yup.string().required(`La date d’expiration est obligatoire.`),
    infoContactId: Yup.string().required(`Le contact "questions" est obligatoire.`),
    missionDescription: Yup.string().trim().required(`Décrire la mission est obligatoire.`),
    professionId: Yup.string().required(`Le métier est obligatoire.`),
    recruiterId: Yup.string().required(`Le recruteur est obligatoire.`),
    remoteStatus: Yup.string().required(`Indiquer les possibilités de télétravail est obligatoire.`),
    salaryMax: Yup.number()
      .nullable()
      .integer(`La rémunération maximum doit être un nombre entier, en millier d'euros.`)
      .min(10, `La rémunération maximum doit être un nombre entier, en millier d'euros.`)
      .max(200, `La rémunération maximum doit être un nombre entier, en millier d'euros.`),
    salaryMin: Yup.number()
      .nullable()
      .integer(`La rémunération minimum doit être un nombre entier, en millier d'euros.`)
      .min(10, `La rémunération minimum doit être un nombre entier, en millier d'euros.`)
      .max(200, `La rémunération minimum doit être un nombre entier, en millier d'euros.`),
    seniorityInYears: Yup.number().required(`Le nombre d’années d’expérience requises est obligatoire.`),
    state: Yup.string().required(`L’état est obligatoire.`),
    title: Yup.string().required(`L’intitulé est obligatoire.`),
  },
  [['applicationContactIds', 'applicationWebsiteUrl']],
)

export default function AdminJobEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState<Partial<JobFormData>>()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNotFound, setIsNotFound] = useState(false)
  const auth = useAuth<Common.Auth.User>()

  const getJobResult = useQuery<
    {
      getJob: JobFromGetOne
    },
    any
  >(queries.job.GET_ONE, {
    variables: {
      id,
    },
  })
  const [createAddress] = useMutation(queries.address.CREATE_ONE)
  const [createJob] = useMutation(queries.job.CREATE_ONE)
  const [updateJob] = useMutation(queries.job.UPDATE_ONE)

  const goToList = useCallback(() => {
    router.push('/admin/jobs')
  }, [])

  const saveAndGoToList = useCallback(async (values: JobFormData) => {
    try {
      setIsLoading(true)

      const input: Partial<Job> = R.pick([
        'applicationContactIds',
        'applicationWebsiteUrl',
        'contextDescription',
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
      ])(values)

      if (isNew) {
        input.id = cuid()
      }
      if (isNew || input.state === JobState.DRAFT) {
        input.slug = slugify(`${input.title}-${input.id}`)
      }

      if (values.addressAsPrismaAddress.id === undefined) {
        const newAddressResult = await createAddress({
          variables: {
            input: values.addressAsPrismaAddress,
          },
        })
        if (newAddressResult.errors) {
          throw new Error(`Cannot create address: ${JSON.stringify(values?.addressAsPrismaAddress)}.`)
        }

        input.addressId = newAddressResult.data.createAddress.id
      } else {
        input.addressId = values.addressAsPrismaAddress.id
      }

      input.expiredAt = dayjs(values.expiredAtAsString).toDate()
      input.seniorityInMonths = values.seniorityInYears * 12

      const options: MutationFunctionOptions = {
        variables: {
          id,
          input,
        },
      }

      if (isNew) {
        const createJobResult = await createJob(options)
        if (createJobResult.data.createJob === null) {
          toast.error('La requête GraphQL de création a échoué.')

          return
        }
      } else {
        const updateJobResult = await updateJob(options)
        if (updateJobResult.data.updateJob === null) {
          toast.error('La requête GraphQL de modification a échoué.')

          return
        }

        await getJobResult.refetch()
      }

      goToList()
    } catch (err) {
      handleError(err, 'pages/admin/job/[id].tsx > saveAndGoToList()')
    }
  }, [])

  useEffect(() => {
    if (!isLoading || isError || isNotFound || getJobResult.loading) {
      return
    }

    if (getJobResult.error) {
      showApolloError(getJobResult.error)

      setIsError(true)

      return
    }

    if (getJobResult.data?.getJob === undefined) {
      setIsNotFound(true)

      return
    }

    if (isNew) {
      setInitialValues({
        expiredAtAsString: dayjs().add(2, 'months').format('YYYY-MM-DD'),
        recruiterId: auth.user?.role === UserRole.RECRUITER ? auth.user?.recruiterId : null,
      })
      setIsLoading(false)

      return
    }

    const initialValues: any = {
      ...getJobResult.data.getJob,
    }

    initialValues.expiredAtAsString = normalizeDateForDateInput(initialValues.expiredAt)

    initialValues.seniorityInYears = Math.ceil(initialValues.seniorityInMonths / 12)

    initialValues.applicationContactIds = initialValues.applicationContacts.map(({ id }) => id)
    initialValues.infoContactId = initialValues.infoContact.id
    initialValues.professionId = initialValues.profession.id
    initialValues.recruiterId = initialValues.recruiter.id

    initialValues.addressAsPrismaAddress = R.omit(['__typename', 'id'])(initialValues.address)

    setInitialValues(initialValues)
    setIsLoading(false)
  }, [getJobResult.data])

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouvelle offre d’emploi' : 'Édition d’une offre d’emploi'}</Title>
      </AdminHeader>

      {isNotFound && <AdminErrorCard error={ADMIN_ERROR.NOT_FOUND} />}
      {isError && <AdminErrorCard error={ADMIN_ERROR.GRAPHQL_REQUEST} />}

      <AdminForm initialValues={initialValues || {}} onSubmit={saveAndGoToList} validationSchema={JobFormSchema}>
        <AdminCard isFirst>
          <Subtitle>Informations essentielles</Subtitle>

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

          {auth.user?.role === UserRole.ADMINISTRATOR && (
            <DoubleField>
              <AdminForm.RecruiterSelect
                isDisabled={isLoading}
                label="Service recruteur *"
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
          )}

          {auth.user?.role === UserRole.RECRUITER && (
            <Field>
              <AdminForm.Select
                isDisabled={isLoading}
                isMulti
                label="Types de contrat *"
                name="contractTypes"
                options={JOB_CONTRACT_TYPES_AS_OPTIONS}
                placeholder="…"
              />
            </Field>
          )}

          <DoubleField>
            <AdminForm.TextInput
              isDisabled={isLoading}
              label="Années d’expérience requises (0 si ouvert aux débutant·es) *"
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

          <Field>
            <AdminForm.ProfessionSelect
              isDisabled={isLoading}
              label="Secteurs d’activité *"
              name="professionId"
              placeholder="…"
            />
          </Field>

          <Field>
            <AdminForm.AddressSelect isDisabled={isLoading} label="Adresse *" name="addressAsPrismaAddress" />
          </Field>
        </AdminCard>

        <AdminCard>
          <Subtitle>Questions</Subtitle>

          <Field>
            <AdminForm.ContactSelect
              isDisabled={isLoading}
              label="Contact unique pour les questions *"
              name="infoContactId"
              placeholder="…"
            />
          </Field>
        </AdminCard>

        <AdminCard>
          <Subtitle>Candidature</Subtitle>

          <Field>
            <AdminForm.ContactSelect
              isDisabled={isLoading}
              isMulti
              label="Contacts pour l’envoi des candidatures **"
              name="applicationContactIds"
              placeholder="…"
            />
          </Field>

          <SeparatorText>OU</SeparatorText>

          <Field>
            <AdminForm.TextInput
              isDisabled={isLoading}
              label="site officiel de candidature (URL) **"
              name="applicationWebsiteUrl"
              type="url"
            />
          </Field>
        </AdminCard>

        <AdminCard>
          <Subtitle>Mission</Subtitle>

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
          <Subtitle>Informations recommandées</Subtitle>

          <Field>
            <AdminForm.TextInput
              isDisabled={isLoading}
              label="Vidéo (URL YouTube ou DailyMotion)"
              name="missionVideoUrl"
            />
          </Field>

          <DoubleField>
            <AdminForm.TextInput
              isDisabled={isLoading}
              label="Rémunération minimum (K€, annuel, brut)"
              name="salaryMin"
              type="number"
            />

            <AdminForm.TextInput
              isDisabled={isLoading}
              label="Rémunération maximum (K€, annuel, brut)"
              name="salaryMax"
              type="number"
            />
          </DoubleField>

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
          <Subtitle>Informations complémentaires</Subtitle>

          <Field>
            <AdminForm.Textarea
              isDisabled={isLoading}
              label="Contexte"
              name="contextDescription"
              placeholder="Contexte de la mission."
            />
          </Field>

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
          <AdminForm.Submit isDisabled={isLoading}>{isNew ? 'Créer' : 'Mettre à jour'}</AdminForm.Submit>
        </AdminCard>
      </AdminForm>
    </>
  )
}
