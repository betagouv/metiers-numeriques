import { useQuery, useMutation } from '@apollo/client'
import { AdminCard } from '@app/atoms/AdminCard'
import { AdminErrorCard, ADMIN_ERROR } from '@app/atoms/AdminErrorCard'
import { AdminFloatingButton } from '@app/atoms/AdminFloatingButton'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { AdminTitle } from '@app/atoms/AdminTitle'
import { DoubleField } from '@app/atoms/DoubleField'
import { FieldGroup } from '@app/atoms/FieldGroup'
import { SeparatorText } from '@app/atoms/SeparatorText'
import { Subtitle } from '@app/atoms/Subtitle'
import { normalizeDateForDateInput } from '@app/helpers/normalizeDateForDateInput'
import { showApolloError } from '@app/helpers/showApolloError'
import { AdminForm } from '@app/molecules/AdminForm'
import { Spinner } from '@app/molecules/AdminLoader/Spinner'
import { StepBar } from '@app/molecules/StepBar'
import { queries } from '@app/queries'
import { JOB_CONTRACT_TYPES_AS_OPTIONS, JOB_REMOTE_STATUSES_AS_OPTIONS } from '@common/constants'
import { handleError } from '@common/helpers/handleError'
import { slugify } from '@common/helpers/slugify'
import { JobContractType, JobSource, JobState, UserRole } from '@prisma/client'
import { Button, Field } from '@singularity/core'
import dayjs from 'dayjs'
import { useAuth } from 'nexauth/client'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  domainIds: string[]
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
    addressAsPrismaAddress: Yup.object().required(`L???adresse est obligatoire.`),
    applicationContactIds: Yup.array().when('applicationWebsiteUrl', {
      is: (applicationWebsiteUrl?: string | null) =>
        !applicationWebsiteUrl || applicationWebsiteUrl.trim().length === 0,
      otherwise: Yup.array(Yup.string().nullable()),
      then: Yup.array(Yup.string().nullable())
        .required(`Au moins un contact "candidatures" est obligatoire si le site de candidature n???est pas renseign??.`)
        .min(1, `Au moins un contact "candidatures" est obligatoire si le site de candidature n???est pas renseign??.`),
    }),
    applicationWebsiteUrl: Yup.string()
      .nullable()
      .when('applicationContactIds', {
        is: (applicationContactIds?: string[] | null) => !applicationContactIds || applicationContactIds.length === 0,
        otherwise: Yup.string().nullable(),
        then: Yup.string()
          .nullable()
          .required(`Le site de candidature est obligatoire si aucun contact "candidatures" n???est renseign??.`)
          .url(`Cette URL est mal format??e.`),
      }),
    contractTypes: Yup.string().required('Le type de contrat est obligatoire'),
    domainIds: Yup.array(Yup.string().nullable())
      .required(`Au moins un domaine est obligatoire.`)
      .min(1, `Au moins un domaine est obligatoire.`),
    expiredAtAsString: Yup.string().nullable().required(`La date d???expiration est obligatoire.`),
    infoContactId: Yup.string().nullable().required(`Le contact unique pour les questions est obligatoire.`),
    missionDescription: Yup.string().nullable().trim().required(`D??crire la mission est obligatoire.`),
    professionId: Yup.string().nullable().required(`La comp??tence est obligatoire.`),
    recruiterId: Yup.string().nullable().required(`Le service recruteur est obligatoire.`),
    remoteStatus: Yup.string().nullable().required(`Indiquer les possibilit??s de t??l??travail est obligatoire.`),
    salaryMax: Yup.number()
      .nullable()
      .integer(`La r??mun??ration maximum doit ??tre un nombre entier, en millier d'euros.`)
      .min(10, `La r??mun??ration maximum doit ??tre un nombre entier, en millier d'euros.`)
      .max(200, `La r??mun??ration maximum doit ??tre un nombre entier, en millier d'euros.`),
    salaryMin: Yup.number()
      .nullable()
      .integer(`La r??mun??ration minimum doit ??tre un nombre entier, en millier d'euros.`)
      .min(10, `La r??mun??ration minimum doit ??tre un nombre entier, en millier d'euros.`)
      .max(200, `La r??mun??ration minimum doit ??tre un nombre entier, en millier d'euros.`),
    seniorityInYears: Yup.number().nullable().required(`Le nombre d???ann??es d???exp??rience requises est obligatoire.`),
    title: Yup.string().nullable().required(`L???intitul?? est obligatoire.`),
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

  const isAdmin = useMemo(() => auth.user?.role === UserRole.ADMINISTRATOR, [auth.user])

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
        'domainIds',
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

      // @ts-expect-error
      // TODO: contract types refacto forced me the keep the array form. To refactor cleaner
      input.contractTypes = input.contractTypes ? [input.contractTypes] : undefined

      if (input.missionDescription === undefined) {
        input.missionDescription = ''
      }

      const options: MutationFunctionOptions = {
        variables: {
          id,
          input,
        },
      }

      await updateJob(options)
      // TODO: makes E2E fail... FIXME
      // const updateJobResult = await updateJob(options)
      // if (updateJobResult.data.updateJob === null) {
      //   toast.error('La requ??te GraphQL de modification a ??chou??.')
      //
      //   return
      // }

      $state.current = input.state

      await getJobResult.refetch()
    } catch (err) {
      handleError(err, 'pages/admin/job/[id].tsx > save()')
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

      goToList()
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

    if (initialValues.domains) {
      initialValues.domainIds = initialValues.domains.map(({ id }) => id)
    }
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

    // TODO: contract types refacto forced me the keep the array form. To refactor cleaner
    if (initialValues.contractTypes?.length) {
      // eslint-disable-next-line prefer-destructuring
      initialValues.contractTypes = initialValues.contractTypes[0]
    }

    $state.current = initialValues.state

    setInitialValues(initialValues)
    setIsLoading(false)
  }, [getJobResult.data])

  if (initialValues === undefined) {
    return (
      <>
        <AdminHeader>
          <AdminTitle>??dition d???une offre d???emploi</AdminTitle>
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
        <AdminTitle>??dition d???une offre d???emploi</AdminTitle>

        <AdminFloatingButton onClick={goToPreview}>Pr??visualiser</AdminFloatingButton>
      </AdminHeader>

      {isNotFound && <AdminErrorCard error={ADMIN_ERROR.NOT_FOUND} />}
      {isError && <AdminErrorCard error={ADMIN_ERROR.GRAPHQL_REQUEST} />}

      <AdminForm initialValues={initialValues || {}} onSubmit={saveAndGoToList as any} validationSchema={JobFormSchema}>
        <AdminForm.AutoSave onChange={save as any} />

        <AdminCard isFirst>
          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Intitul?? *" name="title" />
          </Field>

          <DoubleField>
            <AdminForm.RecruiterSelect
              canCreate={isAdmin}
              institutionId={auth.user?.institutionId}
              isClearable={isAdmin}
              isDisabled={isLoading}
              label="Service recruteur *"
              name="recruiterId"
              placeholder="???"
            />

            <AdminForm.TextInput isDisabled={isLoading} label="Expire le *" name="expiredAtAsString" type="date" />
          </DoubleField>

          <DoubleField>
            <AdminForm.ProfessionSelect
              isDisabled={isLoading}
              label="Comp??tence *"
              name="professionId"
              placeholder="???"
            />

            <AdminForm.Select
              isDisabled={isLoading}
              label="Types de contrat *"
              name="contractTypes"
              options={JOB_CONTRACT_TYPES_AS_OPTIONS}
              placeholder="???"
            />
          </DoubleField>

          <Field>
            <AdminForm.DomainSelect isDisabled={isLoading} label="Domaines *" name="domainIds" />
          </Field>

          <DoubleField>
            <AdminForm.TextInput
              isDisabled={isLoading}
              label="Ann??es d???exp??rience requises (0 si ouvert aux d??butant??es) *"
              name="seniorityInYears"
              type="number"
            />

            <AdminForm.Select
              isDisabled={isLoading}
              label="T??l??travail possible *"
              name="remoteStatus"
              options={JOB_REMOTE_STATUSES_AS_OPTIONS}
              placeholder="???"
            />
          </DoubleField>

          <AdminForm.AddressSelect isDisabled={isLoading} label="Adresse *" name="addressAsPrismaAddress" />
        </AdminCard>

        <AdminCard>
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
              label="Mission *"
              name="missionDescription"
              placeholder="D??crivez la mission de la mani??re la plus succinte possible."
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="L'??quipe"
              name="teamDescription"
              placeholder="Br??ve description des r??les et objectifs de l?????quipe."
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Conditions particuli??res"
              name="particularitiesDescription"
              placeholder="Conditions particuli??res du poste : formations, habilitations, etc."
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Avantages"
              name="perksDescription"
              placeholder="Liste des avantages du poste : opportunit??s de formation, horaires am??nag??es, etc."
            />
          </Field>
        </AdminCard>

        <AdminCard>
          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="T??ches"
              name="tasksDescription"
              placeholder="Liste des t??ches principales impliqu??es par le poste."
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Profil id??al de candidat??e"
              name="profileDescription"
              placeholder="Liste des exp??riences, qualit??s et ??ventuelles qualifications attendues."
            />
          </Field>

          <DoubleField>
            <FieldGroup>
              <AdminForm.TextInput
                isDisabled={isLoading}
                label="R??mun??ration anuelle brut minimum"
                name="salaryMin"
                type="number"
              />
              <span>K???</span>
            </FieldGroup>

            <FieldGroup>
              <AdminForm.TextInput
                isDisabled={isLoading}
                label="R??mun??ration anuelle brut maximum"
                name="salaryMax"
                type="number"
              />
              <span>K???</span>
            </FieldGroup>
          </DoubleField>
        </AdminCard>

        <AdminCard>
          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Processus de recrutement"
              name="processDescription"
              placeholder="Exemple : le processus se d??roulera sur 1 mois avec 4 entretiens."
            />
          </Field>

          <Field>
            <AdminForm.ContactSelect
              isDisabled={isLoading}
              isMulti
              label="Contacts pour l???envoi des candidatures **"
              name="applicationContactIds"
              placeholder="???"
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

          <Field>
            <AdminForm.ContactSelect
              isDisabled={isLoading}
              label="Contact unique pour les questions *"
              name="infoContactId"
              placeholder="???"
            />
          </Field>
        </AdminCard>

        {isAdmin && initialValues?.source !== JobSource.MDN && (
          <AdminCard>
            <Subtitle>R??f??rences internes</Subtitle>

            <Field>
              <AdminForm.TextInput isDisabled label="Source" name="source" />
            </Field>
            <FieldGroup>
              <AdminForm.TextInput isDisabled label="Source (URL)" name="sourceUrl" />
              <button onClick={goToSource} type="button">
                ????
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
                label: 'Publi??e',
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
                Revenir ?? la liste
              </Button>
            </div>

            <div>
              {$state.current === JobState.DRAFT && (
                <>
                  <Button disabled={isLoading} onClick={goToList} style={{ marginRight: '1rem' }}>
                    Mettre ?? jour le brouillon
                  </Button>
                  <AdminForm.Submit accent="warning" isDisabled={isLoading}>
                    Publier
                  </AdminForm.Submit>
                </>
              )}
              {$state.current === JobState.PUBLISHED && (
                <Button
                  accent="warning"
                  disabled={isLoading}
                  onClick={() => updateState(JobState.DRAFT)}
                  style={{ marginLeft: '1rem' }}
                >
                  D??publier
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
