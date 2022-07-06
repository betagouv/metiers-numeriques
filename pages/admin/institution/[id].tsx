import { useQuery, useMutation } from '@apollo/client'
import { AdminCard } from '@app/atoms/AdminCard'
import { AdminErrorCard, ADMIN_ERROR } from '@app/atoms/AdminErrorCard'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { Subtitle } from '@app/atoms/Subtitle'
import { Title } from '@app/atoms/Title'
import { showApolloError } from '@app/helpers/showApolloError'
import { AdminForm } from '@app/molecules/AdminForm'
import { queries } from '@app/queries'
import { USER_ROLE_LABEL } from '@common/constants'
import { handleError } from '@common/helpers/handleError'
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
import type { Institution, File } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

type InstitutionFormInput = Institution & { logoFile: File }

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
  const [createFile] = useMutation(queries.file.CREATE_ONE)
  const [updateFile] = useMutation(queries.file.UPDATE_ONE)

  const saveFile = async (file?: File): Promise<string | undefined> => {
    if (!file) {
      return
    }

    const input = R.pick(['type', 'url', 'title'])(file)

    if (file.id) {
      const updateFileResult = await updateFile({ variables: { id: file.id, input } })
      if (updateFileResult.data.updateFile === null) {
        toast.error('La requête GraphQL de modification de "File" a échoué.')

        return
      }

      return updateFileResult.data.updateFile.id
    }
    const createFileResult = await createFile({ variables: { id: cuid(), input } })
    if (createFileResult.data.createFile === null) {
      toast.error('La requête GraphQL de modification de "File" a échoué.')

      return
    }

    return createFileResult.data.createFile.id
  }

  const users = useMemo(() => {
    if (isNew || getInstitutionResult.data === undefined) {
      return []
    }

    return R.pipe(R.map(R.prop('users')), R.unnest)(getInstitutionResult.data.getInstitution.recruiters)
  }, [getInstitutionResult.data])

  const goToList = useCallback(() => {
    router.push('/admin/institutions')
  }, [])

  const saveAndGoToList = useCallback(async (values: InstitutionFormInput) => {
    try {
      setIsLoading(true)

      // Save logo file first
      const logoFileId = await saveFile(values.logoFile)

      // Save file failed
      if (!!values.logoFile && !logoFileId) {
        throw new Error('Failed to save logo file')
      }

      const input: Partial<Institution> & {
        name: string
      } = R.pick([
        'fullName',
        'name',
        'url',
        'pageTitle',
        'description',
        'challenges',
        'mission',
        'structure',
        'organisation',
      ])(values)

      if (isNew) {
        input.id = cuid()
      }
      input.slug = slugify(input.name, input.id)
      input.logoFileId = logoFileId

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
            <AdminForm.Cancel isDisabled={isLoading} onClick={goToList}>
              Annuler
            </AdminForm.Cancel>
            <AdminForm.Submit isDisabled={isLoading}>{isNew ? 'Créer' : 'Mettre à jour'}</AdminForm.Submit>
          </Field>
        </AdminCard>

        <AdminCard>
          <Subtitle>Page Vitrine</Subtitle>
          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Titre" name="pageTitle" />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Onglet Description"
              name="description"
              placeholder="Présentez l'institution en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Onglet Enjeux"
              name="challenges"
              placeholder="Présentez les enjeux de l'institution en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Onglet Mission"
              name="mission"
              placeholder="Présentez la mission de l'institution en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Onglet Structure"
              name="structure"
              placeholder="Présentez la structure de l'institution en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Editor
              isDisabled={isLoading}
              label="Onglet Organisation"
              name="organisation"
              placeholder="Présentez l'organisation de l'institution en quelques mots"
            />
          </Field>

          <Field>
            <AdminForm.Cancel isDisabled={isLoading} onClick={goToList}>
              Annuler
            </AdminForm.Cancel>
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
