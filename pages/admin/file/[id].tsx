import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import queries from '@app/queries'
import { FILE_TYPE } from '@common/constants'
import { Card, Field } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

import type { MutationFunctionOptions } from '@apollo/client'
import type { File } from '@prisma/client'

const FormSchema = Yup.object().shape({
  title: Yup.string().required(`Le titre est obligatoire.`),
  url: Yup.string().required(`L’url est obligatoire.`),
})

export default function AdminFileEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const getFileResult = useQuery(queries.file.GET_ONE, {
    variables: {
      id,
    },
  })
  const [createFile] = useMutation(queries.file.CREATE_ONE)
  const [updateFile] = useMutation(queries.file.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading || getFileResult.loading || getFileResult.error) {
      return
    }

    const initialValues = {
      ...getFileResult.data.getFile,
    }
    initialValues.typeAsLabel = FILE_TYPE[initialValues.type].label

    setInitialValues({ ...initialValues })
    setIsLoading(false)
  }, [getFileResult, isLoading, isNew])

  const goToList = () => {
    router.push('/admin/files')
  }

  const saveAndGoToList = async (values: any) => {
    setIsLoading(true)

    const input: Partial<File> = R.pick(['title', 'type', 'url'])(values)

    const options: MutationFunctionOptions = {
      variables: {
        id,
        input,
      },
    }

    if (isNew) {
      await createFile(options)
    } else {
      await updateFile(options)
      await getFileResult.refetch()
    }

    goToList()
  }

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouveau fichier' : 'Édition d’un fichier'}</Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
          <Field>
            <Form.TextInput isDisabled={isLoading} label="Titre" name="title" />
          </Field>

          {!isNew && (
            <Field>
              <Form.TextInput isDisabled label="Type" name="typeAsLabel" />
            </Field>
          )}

          <Field>
            <Form.TextInput isDisabled={isLoading} label="URL" name="url" />
          </Field>

          <Field>
            <Form.Cancel isDisabled={isLoading} onClick={goToList}>
              Annuler
            </Form.Cancel>
            <Form.Submit isDisabled={isLoading}>{isNew ? 'Créer' : 'Mettre à jour'}</Form.Submit>
          </Field>
        </Form>
      </Card>
    </>
  )
}
