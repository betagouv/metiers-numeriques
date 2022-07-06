import { AdminCard } from '@app/atoms/AdminCard'
import { ADMIN_ERROR, AdminErrorCard } from '@app/atoms/AdminErrorCard'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { AdminTitle } from '@app/atoms/AdminTitle'
import { AdminForm } from '@app/molecules/AdminForm'
import { handleError } from '@common/helpers/handleError'
import { Field } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useCallback, useEffect, useState } from 'react'
import * as Yup from 'yup'

import type { Testimony, Prisma } from '@prisma/client'

export const TestimonyFormSchema = Yup.object().shape({
  institutionId: Yup.string().required(`L'institution est obligatoire.`),
  job: Yup.string().required(`La profession est obligatoire.`),
  name: Yup.string().required(`Le nom est obligatoire.`),
  testimony: Yup.string().required(`Le témoignage est obligatoire.`),
})

export default function AdminTestimonyEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState<Testimony>()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isNotFound, setIsNotFound] = useState(false)

  useEffect(() => {
    if (isNew) {
      return
    }

    setIsLoading(true)
    fetch(`/api/testimonies/${id}`)
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }
        if (res.status === 404) {
          setIsNotFound(true)
        } else {
          setIsError(true)
        }
      })
      .then(data => {
        setInitialValues(data)
      })
      .catch(err => {
        handleError(err, 'pages/admin/institution/[id].tsx > fetchTestimony()')
        setIsError(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isNew])

  const goToList = useCallback(() => {
    router.push('/admin/testimonies')
  }, [])

  const saveAndGoToList = useCallback(async (values: Prisma.TestimonyUncheckedCreateInput) => {
    try {
      setIsLoading(true)

      const valuesWithoutNestedRelations = R.omit(['avatarFile'])(values)
      const body = JSON.stringify(valuesWithoutNestedRelations)

      if (isNew) {
        await fetch('/api/testimonies', { body, method: 'POST' })
      } else {
        await fetch(`/api/testimonies/${id}`, { body, method: 'PUT' })
      }

      goToList()
    } catch (err) {
      handleError(err, 'pages/admin/institution/[id].tsx > saveAndGoToList()')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <>
      <AdminHeader>
        <AdminTitle>{isNew ? 'Nouveau témoignage' : 'Édition d’un témoignage'}</AdminTitle>
      </AdminHeader>

      {isNotFound && <AdminErrorCard error={ADMIN_ERROR.NOT_FOUND} />}
      {isError && <AdminErrorCard error={ADMIN_ERROR.NEXT_REQUEST} />}

      <AdminForm
        initialValues={initialValues || {}}
        onSubmit={saveAndGoToList as any}
        validationSchema={TestimonyFormSchema}
      >
        <AdminCard isFirst>
          <Field>
            <AdminForm.InstitutionSelect isDisabled={isLoading} label="Institution *" name="institutionId" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Nom *" name="name" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Profession *" name="job" />
          </Field>

          <Field>
            <AdminForm.FileUpload isDisabled={isLoading} label="Avatar" name="avatarFile" />
          </Field>

          <Field>
            <AdminForm.Textarea isDisabled={isLoading} label="Témoignage *" name="testimony" />
          </Field>

          <Field>
            <AdminForm.Cancel isDisabled={isLoading} onClick={goToList}>
              Annuler
            </AdminForm.Cancel>
            <AdminForm.Submit isDisabled={isLoading}>{isNew ? 'Créer' : 'Mettre à jour'}</AdminForm.Submit>
          </Field>
        </AdminCard>
      </AdminForm>
    </>
  )
}
