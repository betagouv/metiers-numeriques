import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import normalizeDateForDateInput from '@app/helpers/normalizeDateForDateInput'
import normalizeDateForDateTimeInput from '@app/helpers/normalizeDateForDateTimeInput'
import { Form } from '@app/molecules/Form'
import queries from '@app/queries'
import { Card, Field } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

import type { MutationFunctionOptions } from '@apollo/client'
import type { LegacyService } from '@prisma/client'

const FormSchema = Yup.object().shape({
  name: Yup.string().required(`Le nom court est obligatoire.`),
  regionAsOption: Yup.object().required(`La région est obligatoire.`),
})

const REGIONS_AS_OPTIONS = [
  {
    label: `Auvergne-Rhône-Alpes`,
    value: `Auvergne-Rhône-Alpes`,
  },
  {
    label: `Bourgogne-Franche-Comté`,
    value: `Bourgogne-Franche-Comté`,
  },
  {
    label: `Bretagne`,
    value: `Bretagne`,
  },
  {
    label: `Centre-Val de Loire`,
    value: `Centre-Val de Loire`,
  },
  {
    label: `Corse`,
    value: `Corse`,
  },
  {
    label: `Grand Est`,
    value: `Grand Est`,
  },
  {
    label: `Guadeloupe`,
    value: `Guadeloupe`,
  },
  {
    label: `Guyane`,
    value: `Guyane`,
  },
  {
    label: `Hauts-de-France`,
    value: `Hauts-de-France`,
  },
  {
    label: `Île-de-France`,
    value: `Île-de-France`,
  },
  {
    label: `La Réunion`,
    value: `La Réunion`,
  },
  {
    label: `Martinique`,
    value: `Martinique`,
  },
  {
    label: `Mayotte`,
    value: `Mayotte`,
  },
  {
    label: `Normandie`,
    value: `Normandie`,
  },
  {
    label: `Nouvelle-Aquitaine`,
    value: `Nouvelle-Aquitaine`,
  },
  {
    label: `Occitanie`,
    value: `Occitanie`,
  },
  {
    label: `Pays de la Loire`,
    value: `Pays de la Loire`,
  },
  {
    label: `Provence-Alpes-Côte d'Azur`,
    value: `Provence-Alpes-Côte d'Azur`,
  },
]

export default function LegacyServiceEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [legacyEntitiesAsOptions, setLegacyEntitiesAsOptions] = useState<
    Array<{
      label: string
      value: string
    }>
  >([])
  const getLegacyServiceResult = useQuery(queries.legacyService.GET_ONE, {
    variables: {
      id: id || '',
    },
  })
  const getLegacyEntitiesResult = useQuery(queries.legacyEntity.GET_ALL)
  const [createLegacyService] = useMutation(queries.legacyService.CREATE_ONE)
  const [updateLegacyService] = useMutation(queries.legacyService.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading || getLegacyEntitiesResult.loading || getLegacyEntitiesResult.error) {
      return
    }

    if (legacyEntitiesAsOptions.length === 0) {
      const newLegacyEntitiesAsOptions = R.pipe(
        R.sortBy(R.prop('name')) as any,
        R.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      )(getLegacyEntitiesResult.data.getLegacyEntities)

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

    newInitialValues.limitDate = normalizeDateForDateInput(newInitialValues.limitDate)
    newInitialValues.updatedAt = normalizeDateForDateTimeInput(newInitialValues.updatedAt)

    if (newInitialValues.legacyEntity !== null) {
      newInitialValues.legacyEntityAsOption = {
        label: newInitialValues.legacyEntity.name,
        value: newInitialValues.legacyEntity.id,
      }
    }

    if (newInitialValues.region !== null) {
      newInitialValues.regionAsOption = {
        label: newInitialValues.region,
        value: newInitialValues.region,
      }
    }

    setInitialValues(newInitialValues)
    setIsLoading(false)
  }, [getLegacyServiceResult, getLegacyEntitiesResult, isLoading, isNew])

  const goToList = () => {
    router.push('/admin/legacy-services')
  }

  const saveAndGoToList = async (values: any) => {
    setIsLoading(true)

    const input: Partial<LegacyService> = R.pick(['fullName', 'name', 'url'])(values)
    if (values.legacyEntityAsOption) {
      input.legacyEntityId = values.legacyEntityAsOption.value
    }
    input.region = values.regionAsOption.value

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
        <Title>{isNew ? 'Nouveau service (legacy)' : 'Édition d’un service (legacy)'}</Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
          <Field>
            <Form.Input isDisabled={isLoading} label="Nom court *" name="name" />
          </Field>

          <Field>
            <Form.Input isDisabled={isLoading} label="Nom complet" name="fullName" />
          </Field>

          <Field>
            <Form.Select
              isDisabled={isLoading}
              label="Entité parente"
              name="legacyEntityAsOption"
              options={legacyEntitiesAsOptions}
            />
          </Field>

          <Field>
            <Form.Select isDisabled={isLoading} label="Région *" name="regionAsOption" options={REGIONS_AS_OPTIONS} />
          </Field>

          <Field>
            <Form.Input isDisabled={isLoading} label="Site Internet (URL)" name="url" />
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
