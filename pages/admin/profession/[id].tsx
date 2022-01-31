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
import type { Profession } from '@prisma/client'

const FormSchema = Yup.object().shape({
  name: Yup.string().required(`Le nom est obligatoire.`),
})

export default function AdminProfessionEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState<Profession>()
  const [isLoading, setIsLoading] = useState(true)

  const getProfessionResult = useQuery<
    {
      getProfession: Profession
    },
    any
  >(queries.profession.GET_ONE, {
    variables: {
      id,
    },
  })
  const [createProfession] = useMutation(queries.profession.CREATE_ONE)
  const [updateProfession] = useMutation(queries.profession.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading) {
      return
    }

    if (isNew) {
      setIsLoading(false)

      return
    }

    if (getProfessionResult.loading || getProfessionResult.error || getProfessionResult.data === undefined) {
      return
    }

    const initialValues = {
      ...getProfessionResult.data.getProfession,
    }

    setInitialValues({ ...initialValues })
    setIsLoading(false)
  }, [getProfessionResult, isLoading, isNew])

  const goToList = () => {
    router.push('/admin/professions')
  }

  const saveAndGoToList = async (values: any) => {
    setIsLoading(true)

    const input: Partial<Profession> = R.pick(['name'])(values)

    const options: MutationFunctionOptions = {
      variables: {
        id,
        input,
      },
    }

    if (isNew) {
      await createProfession(options)
    } else {
      await updateProfession(options)
      await getProfessionResult.refetch()
    }

    goToList()
  }

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouveau métier' : 'Édition d’un métier'}</Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues || {}} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
          <Field>
            <Form.TextInput isDisabled={isLoading} label="Nom *" name="name" />
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
