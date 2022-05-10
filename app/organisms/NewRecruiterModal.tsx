import { useMutation } from '@apollo/client'
import { Button, Field, Modal } from '@singularity/core'
import { RecruiterFormSchema } from 'pages/admin/recruiter/[id]'
import * as R from 'ramda'
import { useCallback, useRef, useState } from 'react'

import { ModalPortal } from '../hocs/ModalPortal'
import { AdminForm } from '../molecules/AdminForm'
import { queries } from '../queries'

import type { MutationFunctionOptions } from '@apollo/client'
import type { Recruiter } from '@prisma/client'

type NewRecruiterModalProps = {
  onCancel: Common.FunctionLike
  onCreate: (newRecruiterId: string) => void | Promise<void>
}

export const NewRecruiterModal = ({ onCancel, onCreate }: NewRecruiterModalProps) => {
  const $form = useRef<HTMLFormElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [createRecruiter] = useMutation(queries.recruiter.CREATE_ONE)

  /* const saveAndCallBack = async () => {
    try {
      setErrors({})

      if ($fullName.current === null || $nameInput.current === null || $websiteUrlInput.current === null) {
        return
      }

      const input: Partial<Recruiter> = {
        fullName: $fullName.current.value,
        name: $nameInput.current.value,
        websiteUrl: $websiteUrlInput.current.value,
      }

      await recruiterSchema.validate(input, {
        abortEarly: false,
      })

      const options: MutationFunctionOptions = {
        variables: {
          input,
        },
      }

      const createRecruiterResult = await createRecruiter(options)

      onCreate(createRecruiterResult.data.createRecruiter.id)
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        const errors = makeErrorsFromYupErrors(err.errors)

        setErrors(errors)

        return
      }

      handleError(err, 'app/organisms/NewRecruiterModal() > saveAndCallBack()')
    }
  } */

  const saveAndCallBack = useCallback(async (values: any) => {
    setIsLoading(true)

    const input: Partial<Recruiter> = R.pick(['displayName', 'institutionId', 'websiteUrl'])(values)

    const options: MutationFunctionOptions = {
      variables: {
        input,
      },
    }

    const createRecruiterResult = await createRecruiter(options)

    onCreate(createRecruiterResult.data.createRecruiter.id)
  }, [])

  return (
    <ModalPortal>
      <Modal
        onCancel={onCancel}
        style={{
          zIndex: 999,
        }}
      >
        <AdminForm ref={$form} initialValues={{}} onSubmit={saveAndCallBack} validationSchema={RecruiterFormSchema}>
          <Modal.Body>
            <Modal.Title>Nouveau recruteur</Modal.Title>

            <Field>
              <AdminForm.TextInput isDisabled={isLoading} label="Nom *" name="displayName" />
            </Field>

            <Field>
              <AdminForm.InstitutionSelect label="Institution *" name="institutionId" />
            </Field>

            <Field>
              <AdminForm.TextInput isDisabled={isLoading} label="Site (URL)" name="websiteUrl" type="url" />
            </Field>
          </Modal.Body>

          <Modal.Action>
            <Button accent="secondary" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">Créer et attacher</Button>
          </Modal.Action>
        </AdminForm>
      </Modal>
    </ModalPortal>
  )
}
