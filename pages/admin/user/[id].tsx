import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import generateKeyFromValue from '@app/helpers/generateKeyFromValue'
import { Form } from '@app/molecules/Form'
import queries from '@app/queries'
import { USER_ROLE_LABEL } from '@common/constants'
import { Card, Field } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import * as Yup from 'yup'

import type { User } from '@prisma/client'

const FormSchema = Yup.object().shape({
  email: Yup.string()
    .required(`L’adresse email est obligatoire.`)
    .email(`Cette addresse email ne semble pas correctement formatté.`),
  firstName: Yup.string().required(`Le prénom est obligatoire.`),
  lastName: Yup.string().required(`Le nom de famille est obligatoire.`),
  roleAsOption: Yup.object().required(`Le rôle est obligatoire.`),
})

const USER_ROLES_AS_OPTIONS = R.pipe(
  R.toPairs,
  R.map(([value, label]) => ({ label, value })),
)(USER_ROLE_LABEL)

export default function UserEditor() {
  const router = useRouter()
  const { id } = router.query

  const getUserResult = useQuery(queries.user.GET_ONE, {
    variables: {
      id,
    },
  })
  const [updateUser, updateUserResult] = useMutation(queries.user.UPDATE_ONE)

  const isLoading = getUserResult.loading || updateUserResult.loading
  const user = isLoading || getUserResult.error ? {} : getUserResult.data.getUser
  const initialValues: any = R.pick(['email', 'firstName', 'lastName', 'isActive'])(user)
  initialValues.roleAsOption = {
    label: USER_ROLE_LABEL[user.role],
    value: user.role,
  }

  const formKey = generateKeyFromValue(initialValues)

  const goToList = () => {
    router.push('/admin/users')
  }

  const saveAndGoToList = async (values: any) => {
    const input: Partial<User> = R.pick(['email', 'firstName', 'isActive', 'lastName'])(values)
    input.role = values.roleAsOption.value

    updateUser({
      variables: {
        id,
        input,
      },
    })

    goToList()
  }

  if (isLoading) {
    return 'Loading...'
  }

  return (
    <>
      <AdminHeader>
        <Title>Édition d’un·e utilisateur·rice</Title>
      </AdminHeader>

      <Card>
        <Form key={formKey} initialValues={initialValues} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
          <Field>
            <Form.Input isDisabled={isLoading} label="Email" name="email" type="email" />
          </Field>

          <Field>
            <Form.Input isDisabled={isLoading} label="Prénom" name="firstName" />
          </Field>

          <Field>
            <Form.Input isDisabled={isLoading} label="Nom" name="lastName" />
          </Field>

          <Field>
            <Form.Select isDisabled={isLoading} label="Rôle" name="roleAsOption" options={USER_ROLES_AS_OPTIONS} />
          </Field>

          <Field>
            <Form.Checkbox isDisabled={isLoading} label="Compte actif" name="isActive" />
          </Field>

          <Field>
            <Form.Cancel isDisabled={isLoading} onClick={goToList}>
              Annuler
            </Form.Cancel>
            <Form.Submit isDisabled={isLoading}>Mettre à jour</Form.Submit>
          </Field>
        </Form>
      </Card>
    </>
  )
}