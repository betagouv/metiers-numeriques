import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import queries from '@app/queries'
import { REGIONS_AS_OPTIONS } from '@common/constants'
import { Card, Field } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

import type { MutationFunctionOptions } from '@apollo/client'
import type { LegacyService } from '@prisma/client'

const FormSchema = Yup.object().shape({
  fullName: Yup.string().nullable(),
  legacyEntityId: Yup.string().nullable(),
  name: Yup.string().required(`Le nom court est obligatoire.`),
  region: Yup.string().required(`La région est obligatoire.`),
  url: Yup.string().nullable(),
})

export default function LegacyServiceEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [legacyEntitiesAsOptions, setLegacyEntitiesAsOptions] = useState<Common.App.SelectOption[]>([])

  const getLegacyServiceResult = useQuery(queries.legacyService.GET_ONE, {
    variables: {
      id: id || '',
    },
  })
  const getLegacyEntitiesListResult = useQuery(queries.legacyEntity.GET_LIST)
  const [createLegacyService] = useMutation(queries.legacyService.CREATE_ONE)
  const [updateLegacyService] = useMutation(queries.legacyService.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading || getLegacyEntitiesListResult.loading || getLegacyEntitiesListResult.error) {
      return
    }

    if (legacyEntitiesAsOptions.length === 0) {
      const newLegacyEntitiesAsOptions = R.pipe(
        R.sortBy(R.prop('name')) as any,
        R.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      )(getLegacyEntitiesListResult.data.getLegacyEntitiesList)

      setLegacyEntitiesAsOptions(newLegacyEntitiesAsOptions)
    }

    if (isNew) {
      setIsLoading(false)

      return
    }

    if (getLegacyServiceResult.loading || getLegacyServiceResult.error) {
      return
    }

    const newInitialValues = {
      ...getLegacyServiceResult.data.getLegacyService,
    }

    if (newInitialValues.legacyEntity !== null) {
      newInitialValues.legacyEntityId = newInitialValues.legacyEntity.id
    }

    setInitialValues(newInitialValues)
    setIsLoading(false)
  }, [getLegacyServiceResult, getLegacyEntitiesListResult, isLoading, isNew])

  const goToList = () => {
    router.push('/admin/legacy-services')
  }

  const saveAndGoToList = async (values: any) => {
    setIsLoading(true)

    const input: Partial<LegacyService> = R.pick(['fullName', 'legacyEntityId', 'name', 'region', 'url'])(values)

    const options: MutationFunctionOptions = {
      variables: {
        id,
        input,
      },
    }

    if (isNew) {
      await createLegacyService(options)
    } else {
      await updateLegacyService(options)
      await getLegacyServiceResult.refetch()
    }

    goToList()
  }

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouveau service [LEGACY]' : 'Édition d’un service [LEGACY]'}</Title>
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
            <Form.Select
              isDisabled={isLoading}
              label="Entité parente"
              name="legacyEntityId"
              options={legacyEntitiesAsOptions}
            />
          </Field>

          <Field>
            <Form.Select isDisabled={isLoading} label="Région *" name="region" options={REGIONS_AS_OPTIONS} />
          </Field>

          <Field>
            <Form.TextInput isDisabled={isLoading} label="Site Internet (URL)" name="url" />
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
