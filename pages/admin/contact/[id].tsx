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
import type { Contact } from '@prisma/client'

const FormSchema = Yup.object().shape({
  email: Yup.string().required(`L’email est obligatoire.`),
  firstName: Yup.string().required(`Le prénom est obligatoire.`),
  lastName: Yup.string().required(`Le nom est obligatoire.`),
})

export default function AdminContactEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState<Contact>()
  const [isLoading, setIsLoading] = useState(true)
  const getContactResult = useQuery<
    {
      getContact: Contact
    },
    any
  >(queries.contact.GET_ONE, {
    variables: {
      id,
    },
  })
  const [createContact] = useMutation(queries.contact.CREATE_ONE)
  const [updateContact] = useMutation(queries.contact.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading || getContactResult.loading || getContactResult.error) {
      return
    }

    if (isNew) {
      setIsLoading(false)

      return
    }

    if (getContactResult.loading || getContactResult.error || getContactResult.data === undefined) {
      return
    }

    const initialValues = {
      ...getContactResult.data.getContact,
    }

    setInitialValues({ ...initialValues })
    setIsLoading(false)
  }, [getContactResult, isLoading, isNew])

  const goToList = () => {
    router.push('/admin/contacts')
  }

  const saveAndGoToList = async (values: any) => {
    setIsLoading(true)

    const input: Partial<Contact> = R.pick(['firstName', 'email', 'lastName', 'note', 'phone'])(values)

    const options: MutationFunctionOptions = {
      variables: {
        id,
        input,
      },
    }

    if (isNew) {
      await createContact(options)
    } else {
      await updateContact(options)
      await getContactResult.refetch()
    }

    goToList()
  }

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouveau contact' : 'Édition d’un contact'}</Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues || {}} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
          <Field>
            <Form.Input isDisabled={isLoading} label="Prénom *" name="firstName" />
          </Field>

          <Field>
            <Form.Input isDisabled={isLoading} label="Nom *" name="lastName" />
          </Field>

          <Field>
            <Form.Input isDisabled={isLoading} label="Email *" name="email" type="email" />
          </Field>

          <Field>
            <Form.Input isDisabled={isLoading} label="Téléphone" name="phone" type="tel" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Notes" name="note" />
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
