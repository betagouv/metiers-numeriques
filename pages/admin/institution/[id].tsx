import { useQuery, useMutation } from '@apollo/client'
import { AdminCard } from '@app/atoms/AdminCard'
import { AdminErrorCard, ADMIN_ERROR } from '@app/atoms/AdminErrorCard'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { AdminTitle } from '@app/atoms/AdminTitle'
import { Subtitle } from '@app/atoms/Subtitle'
import { showApolloError } from '@app/helpers/showApolloError'
import { AdminForm } from '@app/molecules/AdminForm'
import { queries } from '@app/queries'
import { USER_ROLE_LABEL } from '@common/constants'
import { handleError } from '@common/helpers/handleError'
import { slugify } from '@common/helpers/slugify'
import { UserRole } from '@prisma/client'
import { Field, Table } from '@singularity/core'
import cuid from 'cuid'
import { useAuth } from 'nexauth/client'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import * as Yup from 'yup'

import type { InstitutionFromGetOne } from '@api/resolvers/institutions'
import type { MutationFunctionOptions } from '@apollo/client'
import type { Prisma } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const RECRUITER_LIST_COLUMNS: TableColumnProps[] = [
  {
    isSortable: false,
    key: 'displayName',
    label: 'Nom',
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
  const auth = useAuth<Common.Auth.User>()
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

  const goToList = () => {
    if (auth?.user?.role === UserRole.ADMINISTRATOR) {
      router.push('/admin/institutions')
    }
  }

  const saveAndGoToList = useCallback(async (values: Prisma.InstitutionUncheckedCreateInput) => {
    try {
      setIsLoading(true)

      const filteredInput = R.pick([
        'fullName',
        'name',
        'url',
        'logoFileId',
        'pageTitle',
        'testimonyTitle',
        'description',
        'values',
        'challenges',
        'mission',
        'projects',
        'organisation',
        'figures',
        'wantedSkills',
        'recruitmentProcess',
        'workingWithUs',
      ])(values)

      const inputId = isNew ? cuid() : (id as string)
      const inputSlug = isNew ? slugify(values.name) : values.slug

      const input = {
        id: inputId,
        slug: inputSlug,
        ...filteredInput,
      }

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

      toast.success('Institution sauvegardée!')
      goToList()
    } catch (err) {
      handleError(err, 'pages/admin/institution/[id].tsx > saveAndGoToList()')
    } finally {
      setIsLoading(false)
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
        <AdminTitle>{isNew ? 'Nouvelle institution' : 'Édition d’une institution'}</AdminTitle>
      </AdminHeader>

      {isNotFound && <AdminErrorCard error={ADMIN_ERROR.NOT_FOUND} />}
      {isError && <AdminErrorCard error={ADMIN_ERROR.GRAPHQL_REQUEST} />}

      <AdminForm
        initialValues={initialValues || {}}
        onSubmit={saveAndGoToList as any}
        validationSchema={InstitutionFormSchema}
      >
        <AdminCard isFirst>
          <Subtitle>Informations Générales</Subtitle>
          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Nom *" name="name" />
          </Field>

          <Field>
            <AdminForm.FileUpload isDisabled={isLoading} label="Logo" name="logoFile" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Site (URL)" name="url" />
          </Field>

          <Field>
            {auth?.user?.role === UserRole.ADMINISTRATOR && (
              <AdminForm.Cancel isDisabled={isLoading} onClick={goToList}>
                Annuler
              </AdminForm.Cancel>
            )}
            <AdminForm.Submit isDisabled={isLoading}>{isNew ? 'Créer' : 'Mettre à jour'}</AdminForm.Submit>
          </Field>
        </AdminCard>

        <AdminCard>
          <Subtitle>Page Vitrine</Subtitle>
          <Field>
            <AdminForm.TextInput
              isDisabled={isLoading}
              label="Titre"
              name="pageTitle"
              placeholder="Les SIC de la Défense"
            />
          </Field>

          <Field>
            <AdminForm.TextInput
              isDisabled={isLoading}
              label="Titre Témoignages"
              name="testimonyTitle"
              placeholder="Ils travaillent aux SIC de la Défense"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Notre raison d'être"
              name="description"
              placeholder="Présentez l'institution en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Nos valeurs"
              name="values"
              placeholder="Présentez les valeurs d l'institution en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Nos enjeux"
              name="challenges"
              placeholder="Présentez les enjeux de l'institution en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Nos missions"
              name="mission"
              placeholder="Présentez la mission de l'institution en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Nos projets"
              name="projects"
              placeholder="Présentez les projets de l'institution en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Notre organisation"
              name="organisation"
              placeholder="Présentez l'organisation de l'institution en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Nos chiffres clés"
              name="figures"
              placeholder="Présentez les chiffres clés de l'institution en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Les profils recherchés"
              name="wantedSkills"
              placeholder="Présentez le type de profils recherchés en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Nos process de recrutement"
              name="recruitmentProcess"
              placeholder="Présentez le process de recrutement de l'institution en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Nous rejoindre"
              name="workingWithUs"
              placeholder="Expliquez pour rejoindre l'institution en quelques mots"
            />
          </Field>

          <Field>
            {auth?.user?.role === UserRole.ADMINISTRATOR && (
              <AdminForm.Cancel isDisabled={isLoading} onClick={goToList}>
                Annuler
              </AdminForm.Cancel>
            )}
            <AdminForm.Submit isDisabled={isLoading}>{isNew ? 'Créer' : 'Mettre à jour'}</AdminForm.Submit>
          </Field>
        </AdminCard>
      </AdminForm>

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
