import { useQuery, useMutation } from '@apollo/client'
import { AdminHeader } from '@app/atoms/AdminHeader'
import { Title } from '@app/atoms/Title'
import { normalizeDateForDateInput } from '@app/helpers/normalizeDateForDateInput'
import { AdminForm } from '@app/molecules/AdminForm'
import { queries } from '@app/queries'
import { JOB_SOURCES_AS_OPTIONS, REGIONS_AS_OPTIONS } from '@common/constants'
import { slugify } from '@common/helpers/slugify'
import { Card, Field } from '@singularity/core'
import cuid from 'cuid'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

import type { MutationFunctionOptions } from '@apollo/client'
import type { ArchivedJob } from '@prisma/client'

export const ArchivedFormSchema = Yup.object().shape({
  expiredAtAsString: Yup.string().required(`La date d’expiration est obligatoire.`),
  missionDescription: Yup.string().required(`La mission est obligatoire.`),
  professionId: Yup.string().required(`Le métier est obligatoire.`),
  recruiterName: Yup.string().required(`Le recruteur est obligatoire.`),
  region: Yup.string().required(`La région est obligatoire.`),
  source: Yup.string().required(`La source est obligatoire.`),
  title: Yup.string().required(`L’intitulé est obligatoire.`),
})

export default function AdminArchivedJobEditorPage() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [initialValues, setInitialValues] = useState<ArchivedJob>()
  const [isLoading, setIsLoading] = useState(true)

  const getArchivedJobResult = useQuery<
    {
      getArchivedJob: ArchivedJob
    },
    any
  >(queries.archivedJob.GET_ONE, {
    variables: {
      id,
    },
  })
  const [createArchivedJob] = useMutation(queries.archivedJob.CREATE_ONE)
  const [updateArchivedJob] = useMutation(queries.archivedJob.UPDATE_ONE)

  useEffect(() => {
    if (!isLoading) {
      return
    }

    if (isNew) {
      setIsLoading(false)

      return
    }

    if (getArchivedJobResult.loading || getArchivedJobResult.error || getArchivedJobResult.data === undefined) {
      return
    }

    if (isNew) {
      setInitialValues({
        expiredAtAsString: dayjs().add(2, 'months').format('YYYY-MM-DD'),
      } as any)
      setIsLoading(false)

      return
    }

    const initialValues: any = {
      ...getArchivedJobResult.data.getArchivedJob,
    }

    initialValues.expiredAtAsString = normalizeDateForDateInput(initialValues.expiredAt)

    initialValues.professionId = initialValues.profession.id

    setInitialValues({ ...initialValues })
    setIsLoading(false)
  }, [getArchivedJobResult, isLoading, isNew])

  const goToList = () => {
    router.push('/admin/archived-jobs')
  }

  const saveAndGoToList = async (values: any) => {
    setIsLoading(true)

    const input: Partial<ArchivedJob> & {
      title: string
    } = R.pick([
      'missionDescription',
      'professionId',
      'profileDescription',
      'recruiterName',
      'region',
      'source',
      'sourceId',
      'title',
    ])(values) as any

    if (isNew) {
      input.id = cuid()
      input.slug = slugify(input.title, input.id)
    }

    input.expiredAt = dayjs(values.expiredAtAsString).startOf('day').toDate()

    const options: MutationFunctionOptions = {
      variables: {
        id,
        input,
      },
    }

    if (isNew) {
      await createArchivedJob(options)
    } else {
      await updateArchivedJob(options)
      await getArchivedJobResult.refetch()
    }

    goToList()
  }

  return (
    <>
      <AdminHeader>
        <Title>{isNew ? 'Nouvelle offre archivée ' : 'Édition d’une offre archivée'}</Title>
      </AdminHeader>

      <Card>
        <AdminForm initialValues={initialValues || {}} onSubmit={saveAndGoToList} validationSchema={ArchivedFormSchema}>
          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Intitulé *" name="title" />
          </Field>

          <Field>
            <AdminForm.Select isDisabled={isLoading} label="Source *" name="source" options={JOB_SOURCES_AS_OPTIONS} />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Source ID *" name="sourceId" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Expire le *" name="expiredAtAsString" type="date" />
          </Field>

          <Field>
            <AdminForm.TextInput isDisabled={isLoading} label="Service recruteur *" name="recruiterName" />
          </Field>

          <Field>
            <AdminForm.ProfessionSelect isDisabled={isLoading} label="Métier *" name="professionId" placeholder="…" />
          </Field>

          <Field>
            <AdminForm.Select isDisabled={isLoading} label="Région *" name="region" options={REGIONS_AS_OPTIONS} />
          </Field>

          <Field>
            <AdminForm.Textarea
              isDisabled={isLoading}
              label="Mission *"
              name="missionDescription"
              placeholder="Décrivez la mission de la manière la plus succinte possible."
            />
          </Field>

          <Field>
            <AdminForm.Textarea
              isDisabled={isLoading}
              label="Profil"
              name="profileDescription"
              placeholder="Liste des expériences, qualités et éventuelles qualifications attendues."
            />
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
