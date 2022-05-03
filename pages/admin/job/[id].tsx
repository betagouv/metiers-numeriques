import { useQuery, useMutation } from '@apollo/client'
import { AdminCard } from '@app/atoms/AdminCard'
import { AdminErrorCard, ADMIN_ERROR } from '@app/atoms/AdminErrorCard'
import { AdminFloatingButton } from '@app/atoms/AdminFloatingButton'
import AdminHeader from '@app/atoms/AdminHeader'
import { DoubleField } from '@app/atoms/DoubleField'
import { FieldGroup } from '@app/atoms/FieldGroup'
import { SeparatorText } from '@app/atoms/SeparatorText'
import { Subtitle } from '@app/atoms/Subtitle'
import Title from '@app/atoms/Title'
import { normalizeDateForDateInput } from '@app/helpers/normalizeDateForDateInput'
import { showApolloError } from '@app/helpers/showApolloError'
import { AdminForm } from '@app/molecules/AdminForm'
import Spinner from '@app/molecules/AdminLoader/Spinner'
import { StepBar } from '@app/molecules/StepBar'
import queries from '@app/queries'
import { JOB_CONTRACT_TYPES_AS_OPTIONS, JOB_REMOTE_STATUSES_AS_OPTIONS } from '@common/constants'
import { handleError } from '@common/helpers/handleError'
import { slugify } from '@common/helpers/slugify'
import { JobContractType, JobSource, JobState, UserRole } from '@prisma/client'
import { Button, Field } from '@singularity/core'
import dayjs from 'dayjs'
import { useAuth } from 'nexauth/client'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Briefcase, Globe, PenTool } from 'react-feather'
import toast from 'react-hot-toast'
import { Flex } from 'reflexbox'
import styled from 'styled-components'
import * as Yup from 'yup'

import type { JobFromGetOne } from '@api/resolvers/jobs'
import type { MutationFunctionOptions } from '@apollo/client'
import type { Job, Prisma } from '@prisma/client'

type JobFormData = Omit<Prisma.JobCreateInput, 'addressId' | 'expiredAt' | 'seniorityInMonths'> & {
  addressAsPrismaAddress: Prisma.AddressCreateInput
  applicationContactIds: string[]
  contractTypes: JobContractType[]
  expiredAtAsString: string
  infoContactId: string
  professionId: string
  recruiterId: string
  seniorityInYears: number
}

const SpinnerBox = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 1;
  justify-content: center;
`

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
    applicationWebsiteUrl: Yup.string()
      .nullable()
      .when('applicationContactIds', {
        is: (applicationContactIds?: string[] | null) => !applicationContactIds || applicationContactIds.length === 0,
        otherwise: Yup.string().nullable(),
        then: Yup.string()
          .nullable()
          .required(`Le site de candidature est obligatoire si aucun contact "candidatures" n’est renseigné.`)
          .url(`Cette URL est mal formatée.`),
      }),
    contractTypes: Yup.array(Yup.string().nullable())
      .required(`Au moins un type de contrat est obligatoire.`)
      .min(1, `Au moins un type de contrat est obligatoire.`),
    expiredAtAsString: Yup.string().nullable().required(`La date d’expiration est obligatoire.`),
    infoContactId: Yup.string().nullable().required(`Le contact "questions" est obligatoire.`),
    missionDescription: Yup.string().nullable().trim().required(`Décrire la mission est obligatoire.`),
    professionId: Yup.string().nullable().required(`Le métier est obligatoire.`),
    recruiterId: Yup.string().nullable().required(`Le recruteur est obligatoire.`),
    remoteStatus: Yup.string().nullable().required(`Indiquer les possibilités de télétravail est obligatoire.`),
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
    seniorityInYears: Yup.number().nullable().required(`Le nombre d’années d’expérience requises est obligatoire.`),
    title: Yup.string().nullable().required(`L’intitulé est obligatoire.`),
  },
  [['applicationContactIds', 'applicationWebsiteUrl']],
)

export default function AdminJobEditorPage() {
  const router = useRouter()
  const id = router.query.id as string

  const $state = useRef<JobState | undefined>()
  const $slug = useRef<string | undefined>()
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
  const [updateJob] = useMutation(queries.job.UPDATE_ONE)

  const goToList = useCallback(() => {
    router.push('/admin/jobs')
  }, [])

  const goToPreview = useCallback(() => {
    window.open(`/emploi/preview/${id}`, '_blank')
  }, [])

  const goToSource = useCallback(() => {
    if (initialValues === undefined || initialValues.sourceUrl === null || initialValues.sourceUrl === undefined) {
      return
    }

    window.open(initialValues.sourceUrl)
  }, [initialValues])

  const save = useCallback(async (values: JobFormData) => {
    try {
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

      if (typeof input.title !== 'string' || input.title.trim().length === 0) {
        return
      }

      if (input.state === JobState.DRAFT) {
        input.slug = slugify(input.title, id)
        $slug.current = input.slug
      }

      if (values.addressAsPrismaAddress !== undefined) {
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
      }

      input.expiredAt = dayjs(values.expiredAtAsString).startOf('day').toDate()
      input.seniorityInMonths = values.seniorityInYears * 12

      if (input.missionDescription === undefined) {
        input.missionDescription = ''
      }

      const options: MutationFunctionOptions = {
        variables: {
          id,
          input,
        },
      }

      const updateJobResult = await updateJob(options)
      if (updateJobResult.data.updateJob === null) {
        toast.error('La requête GraphQL de modification a échoué.')

        return
      }

      $state.current = input.state

      await getJobResult.refetch()
    } catch (err) {
      handleError(err, 'pages/admin/job/[id].tsx > saveAndGoToList()')
      toast.error(String(err))
    }
  }, [])

  const saveAndGoToList = useCallback(async (values: JobFormData) => {
    try {
      setIsLoading(false)

      await save({
        ...values,
        state: JobState.PUBLISHED,
      })
    } catch (err) {
      handleError(err, 'pages/admin/job/[id].tsx > saveAndGoToList()')

      setIsLoading(false)
    }
  }, [])

  const updateState = useCallback(async (state: JobState) => {
    setIsLoading(true)

    await updateJob({
      variables: {
        id,
        input: {
          state,
        },
      },
    })

    await getJobResult.refetch()

    setIsLoading(false)
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

    const initialValues: any = {
      ...getJobResult.data.getJob,
    }

    initialValues.expiredAtAsString = normalizeDateForDateInput(initialValues.expiredAt)

    initialValues.seniorityInYears = Math.ceil(initialValues.seniorityInMonths / 12)

    initialValues.applicationContactIds = initialValues.applicationContacts.map(({ id }) => id)
    if (initialValues.infoContact !== null) {
      initialValues.infoContactId = initialValues.infoContact.id
    }
    if (initialValues.profession !== null) {
      initialValues.professionId = initialValues.profession.id
    }
    if (initialValues.recruiter !== null) {
      initialValues.recruiterId = initialValues.recruiter.id
    }

    if (initialValues.address !== null) {
      initialValues.addressAsPrismaAddress = R.omit(['__typename', 'id'])(initialValues.address)
    }

    $state.current = initialValues.state

    setInitialValues(initialValues)
    setIsLoading(false)
  }, [getJobResult.data])

  if (initialValues === undefined) {
    return (
      <>
        <AdminHeader>
          <Title>Édition d’une offre d’emploi</Title>
        </AdminHeader>

        <SpinnerBox>
          <Spinner />
        </SpinnerBox>
      </>
    )
  }

  return (
    <>
      <AdminHeader>
        <Title>Édition d’une offre d’emploi</Title>

        <AdminFloatingButton onClick={goToPreview}>Prévisualiser</AdminFloatingButton>
      </AdminHeader>

      {isNotFound && <AdminErrorCard error={ADMIN_ERROR.NOT_FOUND} />}
      {isError && <AdminErrorCard error={ADMIN_ERROR.GRAPHQL_REQUEST} />}

      <AdminForm initialValues={initialValues || {}} onSubmit={saveAndGoToList} validationSchema={JobFormSchema}>
        <AdminForm.AutoSave onChange={save} />

        <AdminCard isFirst>
          <Subtitle>Informations essentielles</Subtitle>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Intitulé *" name="title" />
          </Field>

          <DoubleField>
            <AdminForm.RecruiterSelect
              institutionId={auth.user?.institutionId}
              isDisabled={isLoading}
              label="Service recruteur *"
              name="recruiterId"
              placeholder="…"
            />

            <AdminForm.TextInput isDisabled={isLoading} label="Expire le *" name="expiredAtAsString" type="date" />
          </DoubleField>

          <DoubleField>
            <AdminForm.ProfessionSelect
              isDisabled={isLoading}
              label="Secteur d’activité *"
              name="professionId"
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
            <AdminForm.Editor
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
            <FieldGroup>
              <AdminForm.TextInput
                isDisabled={isLoading}
                label="Rémunération anuelle brut minimum"
                name="salaryMin"
                type="number"
              />
              <span>K€</span>
            </FieldGroup>

            <FieldGroup>
              <AdminForm.TextInput
                isDisabled={isLoading}
                label="Rémunération anuelle brut maximum"
                name="salaryMax"
                type="number"
              />
              <span>K€</span>
            </FieldGroup>
          </DoubleField>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="L'équipe"
              name="teamDescription"
              placeholder="Brève description des rôles et objectifs de l’équipe."
            />
          </Field>

          <Field>
            <AdminForm.Editor
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
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Contexte"
              name="contextDescription"
              placeholder="Contexte de la mission."
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Profil idéal de candidat·e"
              name="profileDescription"
              placeholder="Liste des expériences, qualités et éventuelles qualifications attendues."
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Tâches"
              name="tasksDescription"
              placeholder="Liste des tâches principales impliquées par le poste."
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Conditions particulières"
              name="particularitiesDescription"
              placeholder="Conditions particulières du poste : formations, habilitations, etc."
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Processus de recrutement"
              name="processDescription"
              placeholder="Exemple : le processus se déroulera sur 1 mois avec 4 entretiens."
            />
          </Field>
        </AdminCard>

        {auth.user?.role === UserRole.ADMINISTRATOR && initialValues?.source !== JobSource.MDN && (
          <AdminCard>
            <Subtitle>Références internes</Subtitle>

            <Field>
              <AdminForm.TextInput isDisabled label="Source" name="source" />
            </Field>
            <FieldGroup>
              <AdminForm.TextInput isDisabled label="Source (URL)" name="sourceUrl" />
              <button onClick={goToSource} type="button">
                🔗
              </button>
            </FieldGroup>
          </AdminCard>
        )}

        <Flex justifyContent="center" style={{ margin: '2rem 0 0' }}>
          <StepBar
            activeStepKey={$state.current}
            steps={[
              {
                Icon: PenTool,
                key: JobState.DRAFT,
                label: 'Brouillon',
              },
              {
                Icon: Globe,
                key: JobState.PUBLISHED,
                label: 'Publiée',
              },
              {
                Icon: Briefcase,
                key: JobState.FILLED,
                label: 'Pourvue',
              },
            ]}
          />
        </Flex>

        <AdminCard>
          <AdminForm.Error />

          <Flex justifyContent="space-between">
            <div>
              <Button accent="secondary" disabled={isLoading} onClick={goToList}>
                Revenir à la liste
              </Button>
            </div>

            <div>
              {$state.current === JobState.DRAFT && <AdminForm.Submit isDisabled={isLoading}>Publier</AdminForm.Submit>}
              {$state.current === JobState.PUBLISHED && (
                <Button
                  accent="warning"
                  disabled={isLoading}
                  onClick={() => updateState(JobState.DRAFT)}
                  style={{ marginLeft: '1rem' }}
                >
                  Dépublier
                </Button>
              )}
              {$state.current === JobState.PUBLISHED && (
                <Button
                  disabled={isLoading}
                  onClick={() => updateState(JobState.FILLED)}
                  style={{ marginLeft: '1rem' }}
                >
                  Marquer comme pourvue
                </Button>
              )}
              {$state.current === JobState.FILLED && (
                <Button accent="warning" disabled={isLoading} onClick={() => updateState(JobState.PUBLISHED)}>
                  Republier
                </Button>
              )}
            </div>
          </Flex>
        </AdminCard>
      </AdminForm>
    </>
  )
}
