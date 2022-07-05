import { GetAllResponse } from '@api/resolvers/types'
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
import { Testimony } from '@prisma/client'
import { Field, Table } from '@singularity/core'
import cuid from 'cuid'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import * as Yup from 'yup'

import type { InstitutionFromGetOne } from '@api/resolvers/institutions'
import type { MutationFunctionOptions } from '@apollo/client'
import type { Institution, TestimonyCreateInput } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

export const TestimonyFormSchema = Yup.object().shape({
  institutionId: Yup.string().required(`L'institution est obligatoire.`),
  job: Yup.string().required(`La profession est obligatoire.`),
  name: Yup.string().required(`Le nom est obligatoire.`),
  testimony: Yup.string().required(`Le témoignage est obligatoire.`),
})

export default function AdminTestimonyEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState<TestimonyCreateInput>()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isNotFound, setIsNotFound] = useState(false)

  useEffect(() => {
    if (isNew) {
      return
    }

    setIsLoading(true)
    fetch<Testimony>(`/api/testimonies/${id}`)
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }
        if (res.status === 404) {
          setIsNotFound(true)

          return {}
        }
        setIsError(true)

        return {}
      })
      .then(data => {
        setInitialValues(data)
      })
      .catch(err => {
        handleError(err, 'pages/admin/institution/[id].tsx > fetchTestimony()')
        setIsError(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isNew])

  // const getInstitutionResult = useQuery<
  //   {
  //     getInstitution: InstitutionFromGetOne
  //   },
  //   any
  // >(queries.institution.GET_ONE, {
  //   variables: {
  //     id,
  //   },
  // })
  // const [createInstitution] = useMutation(queries.institution.CREATE_ONE)
  // const [updateInstitution] = useMutation(queries.institution.UPDATE_ONE)
  // const [createFile] = useMutation(queries.file.CREATE_ONE)
  // const [updateFile] = useMutation(queries.file.UPDATE_ONE)
  //
  // const saveFile = async (file?: File): Promise<string | undefined> => {
  //   if (!file) {
  //     return
  //   }
  //
  //   const input = R.pick(['type', 'url', 'title'])(file)
  //
  //   if (file.id) {
  //     const updateFileResult = await updateFile({ variables: { id: file.id, input } })
  //     if (updateFileResult.data.updateFile === null) {
  //       toast.error('La requête GraphQL de modification de "File" a échoué.')
  //
  //       return
  //     }
  //
  //     return updateFileResult.data.updateFile.id
  //   }
  //   const createFileResult = await createFile({ variables: { id: cuid(), input } })
  //   if (createFileResult.data.createFile === null) {
  //     toast.error('La requête GraphQL de modification de "File" a échoué.')
  //
  //     return
  //   }
  //
  //   return createFileResult.data.createFile.id
  // }
  //
  // const users = useMemo(() => {
  //   if (isNew || getInstitutionResult.data === undefined) {
  //     return []
  //   }
  //
  //   return R.pipe(R.map(R.prop('users')), R.unnest)(getInstitutionResult.data.getInstitution.recruiters)
  // }, [getInstitutionResult.data])
  //
  const goToList = useCallback(() => {
    router.push('/admin/testimonies')
  }, [])

  const saveAndGoToList = useCallback(async (values: TestimonyCreateInput) => {
    try {
      setIsLoading(true)

      // Save logo file first
      // const logoFileId = await saveFile(values.logoFile)

      // Save file failed
      // if (!!values.logoFile && !logoFileId) {
      //   throw new Error('Failed to save logo file')
      // }
      if (isNew) {
        await fetch('/api/testimonies', { body: JSON.stringify(values), method: 'POST' })
      } else {
        await fetch(`/api/testimonies/${id}`, { body: JSON.stringify(values), method: 'PUT' })
      }

      goToList()
    } catch (err) {
      handleError(err, 'pages/admin/institution/[id].tsx > saveAndGoToList()')
    } finally {
      setIsLoading(false)
    }
  }, [])
  //
  // useEffect(() => {
  //   if (!isLoading || isError || isNotFound || getInstitutionResult.loading) {
  //     return
  //   }
  //
  //   if (getInstitutionResult.error) {
  //     showApolloError(getInstitutionResult.error)
  //
  //     setIsError(true)
  //
  //     return
  //   }
  //
  //   if (getInstitutionResult.data?.getInstitution === undefined) {
  //     setIsNotFound(true)
  //
  //     return
  //   }
  //
  //   if (isNew) {
  //     setIsLoading(false)
  //
  //     return
  //   }
  //
  //   const initialValues: InstitutionFromGetOne = {
  //     ...getInstitutionResult.data.getInstitution,
  //   }
  //
  //   setInitialValues(initialValues)
  //   setIsLoading(false)
  // }, [getInstitutionResult.data])

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouveau témoignage' : 'Édition d’un témoignage'}</Title>
      </AdminHeader>

      {isNotFound && <AdminErrorCard error={ADMIN_ERROR.NOT_FOUND} />}
      {isError && <AdminErrorCard error={ADMIN_ERROR.NEXT_REQUEST} />}

      <AdminForm
        initialValues={initialValues || {}}
        onSubmit={saveAndGoToList as any}
        validationSchema={TestimonyFormSchema}
      >
        <AdminCard isFirst>
          <Field>
            <AdminForm.InstitutionSelect isDisabled={isLoading} label="Institution *" name="institutionId" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Nom *" name="name" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Profession *" name="job" />
          </Field>

          <Field>
            <AdminForm.FileUpload isDisabled={isLoading} label="Avatar" name="avatarFile" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Témoignage *" name="testimony" />
          </Field>

          <Field>
            <AdminForm.Cancel isDisabled={isLoading} onClick={goToList}>
              Annuler
            </AdminForm.Cancel>
            <AdminForm.Submit isDisabled={isLoading}>{isNew ? 'Créer' : 'Mettre à jour'}</AdminForm.Submit>
          </Field>
        </AdminCard>
      </AdminForm>
    </>
  )
}
