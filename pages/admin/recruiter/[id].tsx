import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Subtitle from '@app/atoms/Subtitle'
import Title from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import queries from '@app/queries'
import { USER_ROLE_LABEL } from '@common/constants'
import { Card, Field, Table } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

import type { RecruiterFromGetOne } from '@api/resolvers/recruiters'
import type { MutationFunctionOptions } from '@apollo/client'
import type { Recruiter } from '@prisma/client'
import type { TableColumnProps } from '@singularity/core'

const FormSchema = Yup.object().shape({
  name: Yup.string().required(`Le nom est obligatoire.`),
})

const USER_LIST_COLUMNS: TableColumnProps[] = [
  {
    isSortable: true,
    key: 'firstName',
    label: 'Prénom',
  },
  {
    isSortable: true,
    key: 'lastName',
    label: 'Nom',
  },
  {
    isSortable: true,
    key: 'email',
    label: 'Email',
  },
  {
    isSortable: true,
    key: 'role',
    label: 'Rôle',
    transform: ({ role }) => USER_ROLE_LABEL[role],
  },
]

export default function AdminRecruiterEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState<RecruiterFromGetOne>()
  const [isLoading, setIsLoading] = useState(true)
  const getRecruiterResult = useQuery<
    {
      getRecruiter: RecruiterFromGetOne
    },
    any
  >(queries.recruiter.GET_ONE, {
    variables: {
      id,
    },
  })
  const [createRecruiter] = useMutation(queries.recruiter.CREATE_ONE)
  const [updateRecruiter] = useMutation(queries.recruiter.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading || getRecruiterResult.loading || getRecruiterResult.error) {
      return
    }

    if (isNew) {
      setIsLoading(false)

      return
    }

    if (getRecruiterResult.loading || getRecruiterResult.error || getRecruiterResult.data === undefined) {
      return
    }

    const initialValues = {
      ...getRecruiterResult.data.getRecruiter,
    }

    setInitialValues({ ...initialValues })
    setIsLoading(false)
  }, [getRecruiterResult, isLoading, isNew])

  const goToList = () => {
    router.push('/admin/recruiters')
  }

  const saveAndGoToList = async (values: any) => {
    setIsLoading(true)

    const input: Partial<Recruiter> = R.pick(['fullName', 'logoFileId', 'name', 'websiteUrl'])(values)

    const options: MutationFunctionOptions = {
      variables: {
        id,
        input,
      },
    }

    if (isNew) {
      await createRecruiter(options)
    } else {
      await updateRecruiter(options)
      await getRecruiterResult.refetch()
    }

    goToList()
  }

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouveau recruteur' : 'Édition d’un recruteur'}</Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues || {}} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
          {/* <Field>
            <Form.Image accept=".svg" isDisabled={isLoading} label="Logo" name="logoFileId" />
          </Field> */}

          <Field>
            <Form.Input isDisabled={isLoading} label="Nom *" name="name" />
          </Field>

          <Field>
            <Form.Input isDisabled={isLoading} label="Nom complet" name="fullName" />
          </Field>

          <Field>
            <Form.Input isDisabled={isLoading} label="Site (URL)" name="websiteUrl" />
          </Field>

          <Field>
            <Form.Cancel isDisabled={isLoading} onClick={goToList}>
              Annuler
            </Form.Cancel>
            <Form.Submit isDisabled={isLoading}>{isNew ? 'Créer' : 'Mettre à jour'}</Form.Submit>
          </Field>
        </Form>
      </Card>

      <Card
        style={{
          marginTop: '1rem',
        }}
      >
        <Subtitle>Utilisateur·rices</Subtitle>

        <Table
          columns={USER_LIST_COLUMNS}
          data={initialValues ? initialValues.users : []}
          defaultSortedKey="lastName"
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
