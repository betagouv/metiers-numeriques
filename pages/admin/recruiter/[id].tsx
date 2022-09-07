import { useQuery, useMutation } from '@apollo/client'
import { AdminCard } from '@app/atoms/AdminCard'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { AdminTitle } from '@app/atoms/AdminTitle'
import { Subtitle } from '@app/atoms/Subtitle'
import { humanizeDate } from '@app/helpers/humanizeDate'
import { AdminForm } from '@app/molecules/AdminForm'
import { queries } from '@app/queries'
import { JOB_STATE_LABEL, USER_ROLE_LABEL } from '@common/constants'
import { Field, Table } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Edit, ExternalLink } from 'react-feather'
import * as Yup from 'yup'

import type { RecruiterFromGetOne } from '@api/resolvers/recruiters'
import type { MutationFunctionOptions } from '@apollo/client'
import type { Job, Recruiter } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

export const RecruiterFormSchema = Yup.object().shape({
  displayName: Yup.string().nullable().required(`Le nom est obligatoire.`),
  institutionId: Yup.string().nullable().required(`L'institution est obligatoire.`),
  websiteUrl: Yup.string().nullable().url(`Cette URL est mal formatée.`),
})

const JOB_LIST_COLUMNS: TableColumnProps[] = [
  {
    grow: 0.45,
    isSortable: true,
    key: 'title',
    label: 'Intitulé',
  },
  {
    grow: 0.15,
    isSortable: true,
    key: 'state',
    label: 'État',
    transform: ({ state }) => JOB_STATE_LABEL[state],
  },
  {
    grow: 0.15,
    isSortable: true,
    key: 'expiredAt',
    label: 'Expire le',
    transform: ({ expiredAt }) => humanizeDate(expiredAt),
  },
  {
    grow: 0.15,
    isSortable: true,
    key: 'updatedAt',
    label: 'MàJ le',
    transform: ({ updatedAt }) => humanizeDate(updatedAt),
  },
]

const USER_LIST_COLUMNS: TableColumnProps[] = [
  {
    grow: 0.25,
    isSortable: true,
    key: 'firstName',
    label: 'Prénom',
  },
  {
    grow: 0.25,
    isSortable: true,
    key: 'lastName',
    label: 'Nom',
  },
  {
    grow: 0.25,
    isSortable: true,
    key: 'email',
    label: 'Email',
  },
  {
    grow: 0.25,
    isSortable: true,
    key: 'role',
    label: 'Rôle',
    transform: ({ role }) => USER_ROLE_LABEL[role],
  },
]

export default function AdminRecruiterEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState<RecruiterFromGetOne>()
  const [isLoading, setIsLoading] = useState(true)
  const getRecruiterResult = useQuery<
    {
      getRecruiter: RecruiterFromGetOne
    },
    any
  >(queries.recruiter.GET_ONE, {
    variables: {
      id,
    },
  })
  const [createRecruiter] = useMutation(queries.recruiter.CREATE_ONE)
  const [updateRecruiter] = useMutation(queries.recruiter.UPDATE_ONE)

  const goToJobEditor = useCallback((id: string) => {
    router.push(`/admin/job/${id}`)
  }, [])

  const goToJobPreview = useCallback(
    (id: string) => {
      if (initialValues === undefined) {
        return
      }

      const job = R.find<Job>(R.propEq('id', id))(initialValues.jobs)
      if (job === undefined) {
        return
      }

      window.open(`/emploi/${job.slug}`)
    },
    [initialValues],
  )

  const goToList = useCallback(() => {
    router.push('/admin/recruiters')
  }, [])

  const saveAndGoToList = useCallback(async (values: any) => {
    setIsLoading(true)

    const input: Partial<Recruiter> = R.pick(['displayName', 'institutionId', 'logoFileId', 'websiteUrl'])(values)

    const options: MutationFunctionOptions = {
      variables: {
        id,
        input,
      },
    }

    if (isNew) {
      await createRecruiter(options)
    } else {
      await updateRecruiter(options)
      await getRecruiterResult.refetch()
    }

    goToList()
  }, [])

  useEffect(() => {
    if (!isLoading || getRecruiterResult.loading || getRecruiterResult.error) {
      return
    }

    if (isNew) {
      setIsLoading(false)

      return
    }

    if (getRecruiterResult.loading || getRecruiterResult.error || getRecruiterResult.data === undefined) {
      return
    }

    const initialValues: any = {
      ...getRecruiterResult.data.getRecruiter,
    }

    if (initialValues.institution) {
      initialValues.institutionId = initialValues.institution.id
    }

    setInitialValues({ ...initialValues })
    setIsLoading(false)
  }, [getRecruiterResult, isLoading, isNew])

  const jobListColumns: TableColumnProps[] = useMemo(
    () => [
      ...JOB_LIST_COLUMNS,
      {
        accent: 'secondary',
        action: goToJobPreview,
        Icon: ExternalLink,
        key: 'preview',
        label: 'Prévisualiser cette offre',
        type: 'action',
      },
      {
        accent: 'primary',
        action: goToJobEditor,
        Icon: Edit,
        key: 'edit',
        label: 'Éditer cette offre',
        type: 'action',
      },
    ],
    [initialValues],
  )

  return (
    <>
      <AdminHeader>
        <AdminTitle>{isNew ? 'Nouveau service recruteur' : 'Édition d’un service recruteur'}</AdminTitle>
      </AdminHeader>

      <AdminCard isFirst>
        <AdminForm
          initialValues={initialValues || {}}
          onSubmit={saveAndGoToList}
          validationSchema={RecruiterFormSchema}
        >
          {/* <Field>
            <AdminForm.Image accept=".svg" isDisabled={isLoading} label="Logo" name="logoFileId" />
          </Field> */}

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Nom *" name="displayName" />
          </Field>

          <Field>
            <AdminForm.InstitutionSelect isDisabled={isLoading} label="Institution *" name="institutionId" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Site (URL)" name="websiteUrl" type="url" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled label="Nom unique" name="name" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled label="Nom complet (LEGACY)" name="fullName" />
          </Field>

          <Field>
            <AdminForm.Cancel isDisabled={isLoading} onClick={goToList}>
              Annuler
            </AdminForm.Cancel>
            <AdminForm.Submit isDisabled={isLoading}>{isNew ? 'Créer' : 'Mettre à jour'}</AdminForm.Submit>
          </Field>
        </AdminForm>
      </AdminCard>

      {!isNew && (
        <AdminCard>
          <Subtitle>Utilisateur·rices</Subtitle>

          <Table
            columns={USER_LIST_COLUMNS}
            data={initialValues ? initialValues.users : []}
            defaultSortedKey="lastName"
            isLoading={isLoading}
          />
        </AdminCard>
      )}

      {!isNew && (
        <AdminCard>
          <Subtitle>Offres d’emploi</Subtitle>

          <Table
            columns={jobListColumns}
            data={initialValues ? initialValues.jobs : []}
            defaultSortedKey="updatedAt"
            defaultSortedKeyIsDesc
            isLoading={isLoading}
          />
        </AdminCard>
      )}
    </>
  )
}
