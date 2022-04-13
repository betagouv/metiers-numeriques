import { useQuery, useMutation } from '@apollo/client'
import { AdminCard } from '@app/atoms/AdminCard'
import { AdminErrorCard, ADMIN_ERROR } from '@app/atoms/AdminErrorCard'
import AdminHeader from '@app/atoms/AdminHeader'
import { Subtitle } from '@app/atoms/Subtitle'
import Title from '@app/atoms/Title'
import { showApolloError } from '@app/helpers/showApolloError'
import { AdminForm } from '@app/molecules/AdminForm'
import queries from '@app/queries'
import { USER_ROLE_LABEL } from '@common/constants'
import handleError from '@common/helpers/handleError'
import { slugify } from '@common/helpers/slugify'
import { Field, Table } from '@singularity/core'
import cuid from 'cuid'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import * as Yup from 'yup'

import type { InstitutionFromGetOne } from '@api/resolvers/institutions'
import type { MutationFunctionOptions } from '@apollo/client'
import type { Institution } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

type InstitutionFormData = Pick<Institution, 'name'>

const RECRUITER_LIST_COLUMNS: TableColumnProps[] = [
  {
    grow: 0.3,
    isSortable: false,
    key: 'name',
    label: 'Nom',
  },
  {
    grow: 0.7,
    isSortable: false,
    key: 'fullName',
    label: 'Nom complet',
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

export const InstitutionFormSchema = Yup.object().shape({
  name: Yup.string().required(`Le nom est obligatoire.`),
})

export default function AdminInstitutionEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState<InstitutionFromGetOne>()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNotFound, setIsNotFound] = useState(false)

  const getInstitutionResult = useQuery<
    {
      getInstitution: InstitutionFromGetOne
    },
    any
  >(queries.institution.GET_ONE, {
    variables: {
      id,
    },
  })
  const [createInstitution] = useMutation(queries.institution.CREATE_ONE)
  const [updateInstitution] = useMutation(queries.institution.UPDATE_ONE)

  const users = useMemo(() => {
    if (isNew || getInstitutionResult.data === undefined) {
      return []
    }

    return R.pipe(R.map(R.prop('users')), R.unnest)(getInstitutionResult.data.getInstitution.recruiters)
  }, [getInstitutionResult.data])

  const goToList = useCallback(() => {
    router.push('/admin/institutions')
  }, [])

  const saveAndGoToList = useCallback(async (values: InstitutionFormData) => {
    try {
      setIsLoading(true)

      const input: Partial<Institution> & {
        name: string
      } = R.pick(['fullName', 'name'])(values)

      if (isNew) {
        input.id = cuid()
      }
      input.slug = slugify(input.name, input.id)

      const options: MutationFunctionOptions = {
        variables: {
          id,
          input,
        },
      }

      if (isNew) {
        const createInstitutionResult = await createInstitution(options)
        if (createInstitutionResult.data.createInstitution === null) {
          toast.error('La requête GraphQL de création a échoué.')

          return
        }
      } else {
        const updateInstitutionResult = await updateInstitution(options)
        if (updateInstitutionResult.data.updateInstitution === null) {
          toast.error('La requête GraphQL de modification a échoué.')

          return
        }

        await getInstitutionResult.refetch()
      }

      goToList()
    } catch (err) {
      handleError(err, 'pages/admin/institution/[id].tsx > saveAndGoToList()')
    }
  }, [])

  useEffect(() => {
    if (!isLoading || isError || isNotFound || getInstitutionResult.loading) {
      return
    }

    if (getInstitutionResult.error) {
      showApolloError(getInstitutionResult.error)

      setIsError(true)

      return
    }

    if (getInstitutionResult.data?.getInstitution === undefined) {
      setIsNotFound(true)

      return
    }

    if (isNew) {
      setIsLoading(false)

      return
    }

    const initialValues: InstitutionFromGetOne = {
      ...getInstitutionResult.data.getInstitution,
    }

    setInitialValues(initialValues)
    setIsLoading(false)
  }, [getInstitutionResult.data])

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouvelle institution' : 'Édition d’une institution'}</Title>
      </AdminHeader>

      {isNotFound && <AdminErrorCard error={ADMIN_ERROR.NOT_FOUND} />}
      {isError && <AdminErrorCard error={ADMIN_ERROR.GRAPHQL_REQUEST} />}

      <AdminCard isFirst>
        <AdminForm
          initialValues={initialValues || {}}
          onSubmit={saveAndGoToList}
          validationSchema={InstitutionFormSchema}
        >
          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Nom *" name="name" />
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
          <Subtitle>Services recruteurs</Subtitle>

          <Table
            columns={RECRUITER_LIST_COLUMNS}
            data={initialValues ? initialValues.recruiters : []}
            defaultSortedKey="name"
            isLoading={isLoading}
          />
        </AdminCard>
      )}

      {!isNew && (
        <AdminCard>
          <Subtitle>Utilisateur·rices</Subtitle>

          <Table columns={USER_LIST_COLUMNS} data={users} defaultSortedKey="lastName" isLoading={isLoading} />
        </AdminCard>
      )}
    </>
  )
}
