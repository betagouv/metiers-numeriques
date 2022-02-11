import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Separator from '@app/atoms/Separator'
import Title from '@app/atoms/Title'
import { normalizeDateForDateInput } from '@app/helpers/normalizeDateForDateInput'
import { normalizeDateForDateTimeInput } from '@app/helpers/normalizeDateForDateTimeInput'
import { withAdminHocs } from '@app/hocs/withAdminHocs'
import { Form } from '@app/molecules/Form'
import queries from '@app/queries'
import { JOB_STATE_LABEL } from '@common/constants'
import { JobSource } from '@prisma/client'
import { Card, Field } from '@singularity/core'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import slugify from 'slugify'
import { v4 as uuid } from 'uuid'
import * as Yup from 'yup'

import type { MutationFunctionOptions } from '@apollo/client'
import type { LegacyJob } from '@prisma/client'

const JOB_STATES_AS_OPTIONS: Common.App.SelectOption[] = R.pipe(
  R.toPairs,
  R.map(([value, label]) => ({
    label,
    value,
  })),
)(JOB_STATE_LABEL) as any

const FormSchema = Yup.object().shape({
  limitDate: Yup.string().required(`La date limite est obligatoire.`),
  state: Yup.string().required(`L’état est obligatoire.`),
  title: Yup.string().required(`L’intitulé est obligatoire.`),
})

function AdminLegacyJobEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [legacyServicesAsOptions, setLegacyServicesAsOptions] = useState<Common.App.SelectOption[]>([])

  const getLegacyJobResult = useQuery(queries.legacyJob.GET_ONE, {
    variables: {
      id: id || '',
    },
  })
  const getLegacyServicesListResult = useQuery(queries.legacyService.GET_LIST)
  const [createLegacyJob] = useMutation(queries.legacyJob.CREATE_ONE)
  const [updateLegacyJob] = useMutation(queries.legacyJob.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading || getLegacyServicesListResult.loading || getLegacyServicesListResult.error) {
      return
    }

    if (legacyServicesAsOptions.length === 0) {
      const newLegacyServicesAsOptions = R.pipe(
        R.sortBy(R.prop('name')) as any,
        R.map(({ id, legacyEntity, name }) => ({
          label: legacyEntity ? `${name} (${legacyEntity.name})` : name,
          value: id,
        })),
      )(getLegacyServicesListResult.data.getLegacyServicesList)

      setLegacyServicesAsOptions(newLegacyServicesAsOptions)
    }

    if (isNew) {
      setInitialValues({
        limitDate: dayjs().add(2, 'months').format('YYYY-MM-DD'),
      })
      setIsLoading(false)

      return
    }

    if (getLegacyJobResult.loading || getLegacyJobResult.error) {
      return
    }

    const newInitialValues = {
      ...getLegacyJobResult.data.getLegacyJob,
    }

    newInitialValues.limitDate = normalizeDateForDateInput(newInitialValues.limitDate)
    newInitialValues.updatedAt = normalizeDateForDateTimeInput(newInitialValues.updatedAt)

    if (newInitialValues.legacyService !== null) {
      newInitialValues.legacyServiceId = newInitialValues.legacyService.id
    }

    newInitialValues.departmentAsJson = JSON.stringify(newInitialValues.department, null, 2)
    newInitialValues.experiencesAsJson = JSON.stringify(newInitialValues.experiences, null, 2)
    newInitialValues.locationsAsJson = JSON.stringify(newInitialValues.locations, null, 2)
    newInitialValues.openedToContractTypesAsJson = JSON.stringify(newInitialValues.openedToContractTypes, null, 2)

    setInitialValues(newInitialValues)
    setIsLoading(false)
  }, [getLegacyJobResult, getLegacyServicesListResult, isLoading, isNew])

  const goToList = () => {
    router.push('/admin/legacy-jobs')
  }

  const saveAndGoToList = async (values: any) => {
    setIsLoading(true)

    const input: Partial<LegacyJob> = R.pick([
      'advantages',
      'conditions',
      'hiringProcess',
      'legacyServiceId',
      'mission',
      'more',
      'profile',
      'salary',
      'state',
      'tasks',
      'team',
      'teamInfo',
      'title',
      'toApply',
    ])(values)

    if (isNew) {
      input.id = uuid()
      input.slug = slugify(`${input.title}-${input.id}`)
      input.reference = `${JobSource.MNN}-${input.id}`
      input.source = JobSource.MNN
    }

    if (values.experiencesAsJson) {
      input.experiences = JSON.parse(values.experiencesAsJson)
    }
    input.limitDate = dayjs(values.limitDate).toDate()
    if (values.locations) {
      input.locations = JSON.parse(values.locationsAsJson)
    }
    if (values.openedToContractTypes) {
      input.openedToContractTypes = JSON.parse(values.openedToContractTypesAsJson)
    }

    const options: MutationFunctionOptions = {
      variables: {
        id,
        input,
      },
    }

    if (isNew) {
      await createLegacyJob(options)
    } else {
      await updateLegacyJob(options)
      await getLegacyJobResult.refetch()
    }

    goToList()
  }

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouvelle offre [LEGACY]' : 'Édition d’une offre [LEGACY]'}</Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
          {!isNew && (
            <Field>
              <Form.TextInput isDisabled label="Référence interne" name="reference" />
            </Field>
          )}

          {!isNew && (
            <Field>
              <Form.TextInput isDisabled label="Slug" name="slug" />
            </Field>
          )}

          <Field>
            <Form.TextInput isDisabled={isLoading} label="Intitulé *" name="title" />
          </Field>

          <Field>
            <Form.Select isDisabled={isLoading} label="État *" name="state" options={JOB_STATES_AS_OPTIONS} />
          </Field>

          <Field>
            <Form.TextInput isDisabled={isLoading} label="Expire le *" name="limitDate" type="date" />
          </Field>

          <Field>
            <Form.Select
              isDisabled={isLoading}
              label="Service (entité recruteuse)"
              name="legacyServiceId"
              options={legacyServicesAsOptions}
            />
          </Field>

          {!isNew && (
            <Field>
              <Form.TextInput isDisabled label="Entité (obsolète)" name="entity" />
            </Field>
          )}

          {!isNew && (
            <Field>
              <Form.Code isDisabled label="Départements (obsolète)" name="departmentAsJson" />
            </Field>
          )}

          {!isNew && (
            <Field>
              <Form.TextInput isDisabled label="Mise à jour le" name="updatedAt" type="datetime-local" />
            </Field>
          )}

          <Field>
            <Form.TextInput isDisabled={isLoading} label="Salaire" name="salary" />
          </Field>

          <Field>
            <Form.Code isDisabled={isLoading} label="Localisations" name="locationsAsJson" />
          </Field>

          <Field>
            <Form.Code isDisabled={isLoading} label="Ouvert aux" name="openedToContractTypesAsJson" />
          </Field>

          <Field>
            <Form.Code isDisabled={isLoading} label="Expérience" name="experiencesAsJson" />
          </Field>

          <Separator />

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Équipe" name="team" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Mission" name="mission" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Ce que vous ferez" name="tasks" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Les plus du poste" name="advantages" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Conditions particulière du poste" name="conditions" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Votre profil" name="profile" />
          </Field>

          <Separator />

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Si vous avez des questions" name="teamInfo" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Pour candidater" name="toApply" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Pour en savoir plus" name="more" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Processus de recrutement" name="hiringProcess" />
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

export default withAdminHocs(AdminLegacyJobEditorPage)
