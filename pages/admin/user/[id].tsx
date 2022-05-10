import { useQuery, useMutation } from '@apollo/client'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { AdminForm } from '@app/molecules/AdminForm'
import { queries } from '@app/queries'
import { USER_ROLE_LABEL } from '@common/constants'
import { Card, Field } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

import type { MutationFunctionOptions } from '@apollo/client'
import type { User } from '@prisma/client'

const FormSchema = Yup.object().shape({
  email: Yup.string().required(`L’adresse email est obligatoire.`).email(`Cette addresse email est mal formatée.`),
  firstName: Yup.string().required(`Le prénom est obligatoire.`),
  isActive: Yup.boolean().required(),
  lastName: Yup.string().required(`Le nom de famille est obligatoire.`),
  recruiterId: Yup.string().nullable(),
  role: Yup.string().required(`Le rôle est obligatoire.`),
})

const USER_ROLES_AS_OPTIONS: Common.App.SelectOption[] = R.pipe(
  R.toPairs,
  R.map(([value, label]) => ({ label, value })),
)(USER_ROLE_LABEL) as any

export default function AdminUserEditorPage() {
  const router = useRouter()
  const { id } = router.query

  const [initialValues, setInitialValues] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const getUserResult = useQuery(queries.user.GET_ONE, {
    variables: {
      id,
    },
  })
  const [updateUser] = useMutation(queries.user.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading) {
      return
    }

    if (getUserResult.loading || getUserResult.error) {
      return
    }

    const newInitialValues = {
      ...getUserResult.data.getUser,
    }

    if (newInitialValues.recruiter !== null) {
      newInitialValues.recruiterId = newInitialValues.recruiter.id
    }

    setInitialValues(newInitialValues)
    setIsLoading(false)
  }, [getUserResult, isLoading])

  const goToList = () => {
    router.push('/admin/users')
  }

  const saveAndGoToList = async (values: any) => {
    const input: Partial<User> = R.pick(['email', 'firstName', 'isActive', 'lastName', 'recruiterId', 'role'])(values)

    const options: MutationFunctionOptions = {
      variables: {
        id,
        input,
      },
    }

    updateUser({
      variables: {
        id,
        input,
      },
    })

    await updateUser(options)
    await getUserResult.refetch()

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
        <AdminForm initialValues={initialValues} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Email" name="email" type="email" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Prénom" name="firstName" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Nom" name="lastName" />
          </Field>

          <Field>
            <AdminForm.Select isDisabled={isLoading} label="Rôle" name="role" options={USER_ROLES_AS_OPTIONS} />
          </Field>

          <Field>
            <AdminForm.RecruiterSelect
              isDisabled={isLoading}
              label="Service recruteur"
              name="recruiterId"
              placeholder="…"
            />
          </Field>

          <Field>
            <AdminForm.Checkbox isDisabled={isLoading} label="Compte actif" name="isActive" />
          </Field>

          <Field>
            <AdminForm.Cancel isDisabled={isLoading} onClick={goToList}>
              Annuler
            </AdminForm.Cancel>
            <AdminForm.Submit isDisabled={isLoading}>Mettre à jour</AdminForm.Submit>
          </Field>
        </AdminForm>
      </Card>
    </>
  )
}
