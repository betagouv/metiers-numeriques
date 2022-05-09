import { useQuery, useMutation } from '@apollo/client'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { AdminForm } from '@app/molecules/AdminForm'
import { queries } from '@app/queries'
import { Card, Field } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

import type { MutationFunctionOptions } from '@apollo/client'
import type { Address } from '@prisma/client'

const FormSchema = Yup.object().shape({
  city: Yup.string().required(`La ville est obligatoire.`),
  country: Yup.string().required(`Le pays est obligatoire.`),
  postalCode: Yup.string().required(`Le code postal est obligatoire.`),
  region: Yup.string().required(`L’état est obligatoire.`),
  street: Yup.string().required(`La rue est obligatoire.`),
})

export default function AdminAddressEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState<Address>()
  const [isLoading, setIsLoading] = useState(true)

  const getAddressResult = useQuery<
    {
      getAddress: Address
    },
    any
  >(queries.address.GET_ONE, {
    variables: {
      id,
    },
  })
  const [createAddress] = useMutation(queries.address.CREATE_ONE)
  const [updateAddress] = useMutation(queries.address.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading) {
      return
    }

    if (isNew) {
      setIsLoading(false)

      return
    }

    if (getAddressResult.loading || getAddressResult.error || getAddressResult.data === undefined) {
      return
    }

    const initialValues = {
      ...getAddressResult.data.getAddress,
    }

    setInitialValues({ ...initialValues })
    setIsLoading(false)
  }, [getAddressResult, isLoading, isNew])

  const goToList = () => {
    router.push('/admin/addresses')
  }

  const saveAndGoToList = async (values: any) => {
    setIsLoading(true)

    const input: Partial<Address> = R.pick(['city', 'country', 'postalCode', 'region', 'street'])(values)

    const options: MutationFunctionOptions = {
      variables: {
        id,
        input,
      },
    }

    if (isNew) {
      await createAddress(options)
    } else {
      await updateAddress(options)
      await getAddressResult.refetch()
    }

    goToList()
  }

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouvelle addresse' : 'Édition d’une addresse'}</Title>
      </AdminHeader>

      <Card>
        <AdminForm initialValues={initialValues || {}} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Rue (ou équivalent) *" name="street" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Code postal *" name="postalCode" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Ville" name="city" />
          </Field>

          <Field>
            <AdminForm.TextInput
              isDisabled={isLoading}
              label="État (ou équivalent : province, région, etc) *"
              name="region"
            />
          </Field>

          <Field>
            <AdminForm.CountrySelect isDisabled={isLoading} label="Pays *" name="country" />
          </Field>

          <Field>
            <AdminForm.Cancel isDisabled={isLoading} onClick={goToList}>
              Annuler
            </AdminForm.Cancel>
            <AdminForm.Submit isDisabled={isLoading}>{isNew ? 'Créer' : 'Mettre à jour'}</AdminForm.Submit>
          </Field>
        </AdminForm>
      </Card>
    </>
  )
}
