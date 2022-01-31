import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import queries from '@app/queries'
import { Card, Field } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

import type { MutationFunctionOptions } from '@apollo/client'
import type { LegacyEntity } from '@prisma/client'

const FormSchema = Yup.object().shape({
  name: Yup.string().required(`Le nom court est obligatoire.`),
})

export default function LegacyEntityEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const getLegacyEntityResult = useQuery(queries.legacyEntity.GET_ONE, {
    variables: {
      id,
    },
  })
  const [createLegacyEntity] = useMutation(queries.legacyEntity.CREATE_ONE)
  const [updateLegacyEntity] = useMutation(queries.legacyEntity.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading || getLegacyEntityResult.loading || getLegacyEntityResult.error) {
      return
    }

    if (isNew) {
      setIsLoading(false)

      return
    }

    const initialValues = {
      ...getLegacyEntityResult.data.getLegacyEntity,
    }

    setInitialValues(initialValues)
    setIsLoading(false)
  }, [getLegacyEntityResult, isLoading, isNew])

  const goToList = () => {
    router.push('/admin/legacy-entities')
  }

  const saveAndGoToList = async (values: any) => {
    setIsLoading(true)

    const input: Partial<LegacyEntity> = R.pick(['fullName', 'logoUrl', 'name'])(values)

    const options: MutationFunctionOptions = {
      variables: {
        id,
        input,
      },
    }

    if (isNew) {
      await createLegacyEntity(options)
    } else {
      await updateLegacyEntity(options)
      await getLegacyEntityResult.refetch()
    }

    goToList()
  }

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouvelle entité [LEGACY]' : 'Édition d’une entité [LEGACY]'}</Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
          <Field>
            <Form.TextInput isDisabled={isLoading} label="Nom court *" name="name" />
          </Field>

          <Field>
            <Form.TextInput isDisabled={isLoading} label="Nom complet" name="fullName" />
          </Field>

          <Field>
            <Form.TextInput isDisabled={isLoading} label="Logo (URL)" name="logoUrl" />
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
