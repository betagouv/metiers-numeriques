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

import type { Domain, Prisma } from '@prisma/client'

export const DomainFormSchema = Yup.object().shape({
  name: Yup.string().required(`Le nom est obligatoire.`),
})

export default function AdminDomainEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState<Domain>()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isNotFound, setIsNotFound] = useState(false)

  useEffect(() => {
    if (isNew) {
      return
    }

    setIsLoading(true)
    fetch(`/api/domains/${id}`)
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
        handleError(err, 'pages/admin/domain/[id].tsx > fetchDomain()')
        setIsError(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isNew])

  const goToList = useCallback(() => {
    router.push('/admin/domains')
  }, [])

  const saveAndGoToList = useCallback(async (values: Prisma.DomainCreateInput) => {
    try {
      setIsLoading(true)

      const body = JSON.stringify(values)

      if (isNew) {
        await fetch('/api/domains', { body, method: 'POST' })
      } else {
        await fetch(`/api/domains/${id}`, { body, method: 'PUT' })
      }

      goToList()
    } catch (err) {
      handleError(err, 'pages/admin/domain/[id].tsx > saveAndGoToList()')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <>
      <AdminHeader>
        <AdminTitle>{isNew ? 'Nouveau domaine' : 'Édition d’un domaine'}</AdminTitle>
      </AdminHeader>

      {isNotFound && <AdminErrorCard error={ADMIN_ERROR.NOT_FOUND} />}
      {isError && <AdminErrorCard error={ADMIN_ERROR.NEXT_REQUEST} />}

      <AdminForm
        initialValues={initialValues || {}}
        onSubmit={saveAndGoToList as any}
        validationSchema={DomainFormSchema}
      >
        <AdminCard isFirst>
          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Nom *" name="name" />
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
