import { useQuery, useMutation } from '@apollo/client'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import queries from '@app/queries'
import { Card, Field } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import slugify from 'slugify'
import { v4 as uuid } from 'uuid'
import * as Yup from 'yup'

import type { MutationFunctionOptions } from '@apollo/client'
import type { LegacyInstitution } from '@prisma/client'

const FormSchema = Yup.object().shape({
  title: Yup.string().required(`Le nom court est obligatoire.`),
})

export default function LegacyInstitutionEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const getLegacyInstitutionResult = useQuery(queries.legacyInstitution.GET_ONE, {
    variables: {
      id,
    },
  })
  const [createLegacyInstitution] = useMutation(queries.legacyInstitution.CREATE_ONE)
  const [updateLegacyInstitution] = useMutation(queries.legacyInstitution.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading || getLegacyInstitutionResult.loading || getLegacyInstitutionResult.error) {
      return
    }

    if (isNew) {
      setIsLoading(false)

      return
    }

    const initialValues = {
      ...getLegacyInstitutionResult.data.getLegacyInstitution,
    }

    setInitialValues(initialValues)
    setIsLoading(false)
  }, [getLegacyInstitutionResult, isLoading, isNew])

  const goToList = () => {
    router.push('/admin/legacy-institutions')
  }

  const saveAndGoToList = async (values: any) => {
    setIsLoading(true)

    const input: Partial<LegacyInstitution> = R.pick([
      'address',
      'challenges',
      'fullName',
      'hiringProcess',
      'joinTeam',
      'keyNumbers',
      'missions',
      'motivation',
      'organization',
      'profile',
      'project',
      'schedule',
      'testimonial',
      'title',
      'value',
    ])(values)

    if (isNew) {
      input.id = uuid()
      input.slug = slugify(`${input.title}-${input.id}`)
    }

    const options: MutationFunctionOptions = {
      variables: {
        id,
        input,
      },
    }

    if (isNew) {
      await createLegacyInstitution(options)
    } else {
      await updateLegacyInstitution(options)
      await getLegacyInstitutionResult.refetch()
    }

    goToList()
  }

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouvelle institution [LEGACY]' : 'Édition d’une institution [LEGACY]'}</Title>
      </AdminHeader>

      <Card>
        <Form initialValues={initialValues} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
          {!isNew && (
            <Field>
              <Form.Input isDisabled label="Slug" name="slug" />
            </Field>
          )}

          <Field>
            <Form.Input isDisabled={isLoading} label="Nom court *" name="title" />
          </Field>

          <Field>
            <Form.Input isDisabled={isLoading} label="Nom complet" name="fullName" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Raison d’être" name="motivation" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Valeurs" name="value" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Nos enjeux" name="challenges" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Missions" name="missions" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Projets" name="project" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Notre organisation" name="organization" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Nos agents en parlent" name="testimonial" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Ton profil" name="profile" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Processus de recrutement" name="hiringProcess" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Nous rejoindre" name="joinTeam" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Chiffres-clés" name="keyNumbers" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Agenda" name="schedule" />
          </Field>

          <Field>
            <Form.Textarea isDisabled={isLoading} label="Adresse" name="address" />
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
