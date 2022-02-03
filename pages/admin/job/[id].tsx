import { useQuery, useMutation } from '@apollo/client'
import { AdminCard } from '@app/atoms/AdminCard'
import { AdminErrorCard, ADMIN_ERROR } from '@app/atoms/AdminErrorCard'
import AdminHeader from '@app/atoms/AdminHeader'
import { DoubleField } from '@app/atoms/DoubleField'
import { Subtitle } from '@app/atoms/Subtitle'
import Title from '@app/atoms/Title'
import { normalizeDateForDateInput } from '@app/helpers/normalizeDateForDateInput'
import { showApolloError } from '@app/helpers/showApolloError'
import { Form } from '@app/molecules/Form'
import queries from '@app/queries'
import { JOB_CONTRACT_TYPES_AS_OPTIONS, JOB_REMOTE_STATUSES_AS_OPTIONS, JOB_STATES_AS_OPTIONS } from '@common/constants'
import handleError from '@common/helpers/handleError'
import { JobState } from '@prisma/client'
import { Field } from '@singularity/core'
import cuid from 'cuid'
import dayjs from 'dayjs'
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

const FormSchema = Yup.object().shape({
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
  professionId: Yup.string().required(`Le métier est obligatoire.`),
  recruiterId: Yup.string().required(`Le recruteur est obligatoire.`),
  remoteStatus: Yup.string().required(`Indiquer les possibilités de télétravail est obligatoire.`),
  seniorityInYears: Yup.number().required(`Le nombre d’années d’expérience requises est obligatoire.`),
  state: Yup.string().required(`L’état est obligatoire.`),
  title: Yup.string().required(`L’intitulé est obligatoire.`),
})

export default function AdminJobEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState<Partial<JobFormData>>()
  const [isNotFound, setIsNotFound] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [contactsAsOptions, setContactsAsOptions] = useState<Common.App.SelectOption[]>([])
  const [professionsAsOptions, setProfessionsAsOptions] = useState<Common.App.SelectOption[]>([])
  const [recruitersAsOptions, setRecruitersAsOptions] = useState<Common.App.SelectOption[]>([])

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
  const getContactsListResult = useQuery(queries.contact.GET_LIST)
  const getProfessionsListResult = useQuery(queries.profession.GET_LIST)
  const getRecruitersListResult = useQuery(queries.recruiter.GET_LIST)
  const [createJob] = useMutation(queries.job.CREATE_ONE)
  const [updateJob] = useMutation(queries.job.UPDATE_ONE)
  const [createAddress] = useMutation(queries.address.CREATE_ONE)

  const goToList = useCallback(() => {
    router.push('/admin/jobs')
  }, [])

  const saveAndGoToList = useCallback(async (values: JobFormData) => {
    try {
      setIsLoading(true)

      const newAddressResult = await createAddress({
        errorPolicy: 'all',
        variables: {
          input: values.addressAsPrismaAddress,
        },
      })
      if (newAddressResult.errors) {
        throw new Error(`Cannot create address: ${JSON.stringify(values?.addressAsPrismaAddress)}.`)
      }

      const input: Partial<Job> = R.pick([
        'addressId',
        'applicationContactIds',
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

      input.addressId = newAddressResult.data.createAddress.id
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
    if (
      !isLoading ||
      isError ||
      isNotFound ||
      getContactsListResult.loading ||
      getJobResult.loading ||
      getProfessionsListResult.loading ||
      getRecruitersListResult.loading
    ) {
      return
    }

    if (
      getJobResult.error ||
      getContactsListResult.error ||
      getProfessionsListResult.error ||
      getRecruitersListResult.error
    ) {
      showApolloError(getJobResult.error)
      showApolloError(getContactsListResult.error)
      showApolloError(getProfessionsListResult.error)
      showApolloError(getRecruitersListResult.error)

      setIsError(true)

      return
    }

    if (getJobResult.data?.getJob === undefined) {
      setIsNotFound(true)

      return
    }

    if (contactsAsOptions.length === 0) {
      const newContactsAsOptions = R.pipe(
        R.sortBy(R.prop('lastName')) as any,
        R.map(({ firstName, id, lastName }) => ({
          label: `${firstName} ${lastName}`,
          value: id,
        })),
      )(getContactsListResult.data.getContactsList)

      setContactsAsOptions(newContactsAsOptions)
    }

    if (professionsAsOptions.length === 0) {
      const newProfessionsAsOptions = R.pipe(
        R.sortBy(R.prop('name')) as any,
        R.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      )(getProfessionsListResult.data.getProfessionsList)

      setProfessionsAsOptions(newProfessionsAsOptions)
    }

    if (recruitersAsOptions.length === 0) {
      const newRecruitersAsOptions = R.pipe(
        R.sortBy(R.prop('name')) as any,
        R.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      )(getRecruitersListResult.data.getRecruitersList)

      setRecruitersAsOptions(newRecruitersAsOptions)
    }

    if (isNew) {
      setInitialValues({
        expiredAtAsString: dayjs().add(2, 'months').format('YYYY-MM-DD'),
      })
      setIsLoading(false)

      return
    }

    const newInitialValues: any = {
      ...getJobResult.data.getJob,
    }

    newInitialValues.expiredAtAsString = normalizeDateForDateInput(newInitialValues.expiredAt)

    newInitialValues.seniorityInYears = Math.ceil(newInitialValues.seniorityInMonths / 12)

    newInitialValues.applicationContactIds = newInitialValues.applicationContacts.map(({ id }) => id)
    newInitialValues.infoContactId = newInitialValues.infoContact.id
    newInitialValues.professionId = newInitialValues.profession.id
    newInitialValues.recruiterId = newInitialValues.recruiter.id

    setInitialValues(newInitialValues)
    setIsLoading(false)
  }, [getContactsListResult.data, getJobResult.data, getProfessionsListResult.data, getRecruitersListResult])

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouvelle offre' : 'Édition d’une offre'}</Title>
      </AdminHeader>

      {isNotFound && <AdminErrorCard error={ADMIN_ERROR.NOT_FOUND} />}
      {isError && <AdminErrorCard error={ADMIN_ERROR.GRAPHQL_REQUEST} />}

      <Form initialValues={initialValues || {}} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
        <AdminCard isFirst>
          <Subtitle>Informations essentielles</Subtitle>

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
            <Form.Select
              isDisabled={isLoading}
              label="Recruteur *"
              name="recruiterId"
              options={recruitersAsOptions}
              placeholder="…"
            />

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
              label="Années d’expérience requises (0 si ouvert aux débutant·es) *"
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
            <Form.Select
              isDisabled={isLoading}
              label="Métier *"
              name="professionId"
              options={professionsAsOptions}
              placeholder="…"
            />

            <Form.Select isDisabled label="Étiquettes *" name="tagIds" options={[]} placeholder="…" />
          </DoubleField>

          <DoubleField>
            <Form.Select
              isDisabled={isLoading}
              label="Contact unique pour les questions *"
              name="infoContactId"
              options={contactsAsOptions}
              placeholder="…"
            />

            <Form.Select
              isDisabled={isLoading}
              isMulti
              label="Contacts pour l’envoi des candidatures *"
              name="applicationContactIds"
              options={contactsAsOptions}
              placeholder="…"
            />
          </DoubleField>

          <Field>
            <Form.AddressSelect isDisabled={isLoading} label="Adresse *" name="addressAsPrismaAddress" />
          </Field>

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
          <Subtitle>Informations recommandées</Subtitle>

          <Field>
            <Form.TextInput isDisabled={isLoading} label="Vidéo (URL YouTube ou DailyMotion)" name="missionVideoUrl" />
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
          <Subtitle>Informations complémentaires</Subtitle>

          <Field>
            <Form.Textarea
              isDisabled={isLoading}
              label="Profil de candidat·e idéal·e"
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
        </AdminCard>

        <AdminCard>
          <Form.Cancel isDisabled={isLoading} onClick={goToList}>
            Annuler
          </Form.Cancel>
          <Form.Submit isDisabled={isLoading}>{isNew ? 'Créer' : 'Mettre à jour'}</Form.Submit>
        </AdminCard>
      </Form>
    </>
  )
}
