import { useQuery, useMutation } from '@apollo/client'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { AdminTitle } from '@app/atoms/AdminTitle'
import { AdminForm } from '@app/molecules/AdminForm'
import { queries } from '@app/queries'
import { Card, Field } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

import type { MutationFunctionOptions } from '@apollo/client'
import type { LegacyInstitution } from '@prisma/client'

const FormSchema = Yup.object().shape({
  title: Yup.string().required(`Le nom court est obligatoire.`),
})

export default function AdminLegacyInstitutionEditorPage() {
  const router = useRouter()
  const { id } = router.query

  const [initialValues, setInitialValues] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const getLegacyInstitutionResult = useQuery(queries.legacyInstitution.GET_ONE, {
    variables: {
      id,
    },
  })
  const [updateLegacyInstitution] = useMutation(queries.legacyInstitution.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading || getLegacyInstitutionResult.loading || getLegacyInstitutionResult.error) {
      return
    }

    const initialValues = {
      ...getLegacyInstitutionResult.data.getLegacyInstitution,
    }

    setInitialValues(initialValues)
    setIsLoading(false)
  }, [getLegacyInstitutionResult, isLoading])

  const goToList = () => {
    router.push('/admin/legacy-institutions')
  }

  const saveAndGoToList = async (values: any) => {
    setIsLoading(true)

    const input: Partial<LegacyInstitution> & {
      title: string
    } = R.pick([
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
    ])(values) as any

    const options: MutationFunctionOptions = {
      variables: {
        id,
        input,
      },
    }

    await updateLegacyInstitution(options)
    await getLegacyInstitutionResult.refetch()

    goToList()
  }

  return (
    <>
      <AdminHeader>
        <AdminTitle>Édition d’une institution [LEGACY]</AdminTitle>
      </AdminHeader>

      <Card>
        <AdminForm initialValues={initialValues} onSubmit={saveAndGoToList} validationSchema={FormSchema}>
          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Nom court *" name="title" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Nom complet" name="fullName" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Raison d’être" name="motivation" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Valeurs" name="value" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Nos enjeux" name="challenges" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Missions" name="missions" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Projets" name="project" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Notre organisation" name="organization" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Nos agents en parlent" name="testimonial" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Ton profil" name="profile" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Processus de recrutement" name="hiringProcess" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Nous rejoindre" name="joinTeam" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Chiffres-clés" name="keyNumbers" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Agenda" name="schedule" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Adresse" name="address" />
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
