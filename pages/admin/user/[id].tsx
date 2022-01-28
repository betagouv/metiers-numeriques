import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import queries from '@app/queries'
import { USER_ROLE_LABEL } from '@common/constants'
import { Card, Field } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

import type { MutationFunctionOptions } from '@apollo/client'
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

  // const isLoading = getUserResult.loading || updateUserResult.loading
  // const user = isLoading || getUserResult.error ? {} : getUserResult.data.getUser
  // const initialValues: any = R.pick(['email', 'firstName', 'lastName', 'isActive'])(user)
  // initialValues.roleAsOption = {
  //   label: USER_ROLE_LABEL[user.role],
  //   value: user.role,
  // }
  const [initialValues, setInitialValues] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [recruitersAsOptions, setRecruitersAsOptions] = useState<
    Array<{
      label: string
      value: string
    }>
  >([])

  const getUserResult = useQuery(queries.user.GET_ONE, {
    variables: {
      id,
    },
  })
  const getRecruitersListResult = useQuery(queries.recruiter.GET_LIST)
  const [updateUser] = useMutation(queries.user.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading || getRecruitersListResult.loading || getRecruitersListResult.error) {
      return
    }

    if (recruitersAsOptions.length === 0) {
      const newRecruitersAsOptions = R.pipe(
        R.sortBy(R.prop('name')) as any,
        R.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      )(getRecruitersListResult.data.getRecruitersList)

      setRecruitersAsOptions(newRecruitersAsOptions)
    }

    if (getUserResult.loading || getUserResult.error) {
      return
    }

    const newInitialValues = {
      ...getUserResult.data.getUser,
    }

    newInitialValues.roleAsOption = {
      label: USER_ROLE_LABEL[newInitialValues.role],
      value: newInitialValues.role,
    }

    if (newInitialValues.recruiter !== null) {
      newInitialValues.recruiterAsOption = {
        label: newInitialValues.recruiter.name,
        value: newInitialValues.recruiter.id,
      }
    }

    setInitialValues(newInitialValues)
    setIsLoading(false)
  }, [getUserResult, getRecruitersListResult, isLoading])

  const goToList = () => {
    router.push('/admin/users')
  }

  const saveAndGoToList = async (values: any) => {
    const input: Partial<User> = R.pick(['email', 'firstName', 'isActive', 'lastName'])(values)
    if (values.recruiterAsOption) {
      input.recruiterId = values.recruiterAsOption.value
    }
    input.role = values.roleAsOption.value

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
        <Form initialValues={initialValues} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
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
            <Form.Select
              isDisabled={isLoading}
              label="Recruteur"
              name="recruiterAsOption"
              options={recruitersAsOptions}
            />
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
