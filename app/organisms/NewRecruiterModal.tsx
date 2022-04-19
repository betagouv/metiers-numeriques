import { useMutation } from '@apollo/client'
import { handleError } from '@common/helpers/handleError'
import { Button, Field, Modal, TextInput } from '@singularity/core'
import { KeyboardEventHandler, useRef, useState } from 'react'
import * as Yup from 'yup'

import queries from '../queries'

import type { MutationFunctionOptions } from '@apollo/client'
import type { Recruiter } from '@prisma/client'

const recruiterSchema = Yup.object().shape({
  name: Yup.string().required(`[name] Le nom est obligatoire.`),
  websiteUrl: Yup.string().url(`Cette URL est mal formatée.`),
})

type NewRecruiterModalProps = {
  onCancel: Common.FunctionLike
  onCreate: (newRecruiterId: string) => void | Promise<void>
}

const makeErrorsFromYupErrors = (yupErrors: string[]): Record<string, string> => {
  const errors = {}
  yupErrors.forEach(yupError => {
    const result = /\[([a-z]+)\] (.+)/i.exec(yupError)
    if (result === null) {
      return
    }

    const [, key, message] = result

    errors[key] = message
  })

  return errors
}

export const NewRecruiterModal = ({ onCancel, onCreate }: NewRecruiterModalProps) => {
  const $fullName = useRef<HTMLInputElement>(null)
  const $nameInput = useRef<HTMLInputElement>(null)
  const $websiteUrlInput = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [createRecruiter] = useMutation(queries.recruiter.CREATE_ONE)

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    saveAndCallBack()
  }

  const saveAndCallBack = async () => {
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
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = makeErrorsFromYupErrors(err.errors)

        setErrors(errors)

        return
      }

      handleError(err, 'app/organisms/NewRecruiterModal() > saveAndCallBack()')
    }
  }

  return (
    <Modal
      onCancel={onCancel}
      style={{
        zIndex: 999,
      }}
    >
      <Modal.Body>
        <Modal.Title>Nouveau recruteur</Modal.Title>

        <Field>
          <TextInput ref={$nameInput} error={errors.name} label="Nom *" onKeyPress={handleKeyPress} />
        </Field>

        <Field>
          <TextInput ref={$fullName} error={errors.fullName} label="Nom complet" onKeyPress={handleKeyPress} />
        </Field>

        <Field>
          <TextInput
            ref={$websiteUrlInput}
            error={errors.websiteUrl}
            label="Site (URL)"
            onKeyPress={handleKeyPress}
            type="url"
          />
        </Field>
      </Modal.Body>

      <Modal.Action>
        <Button accent="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={saveAndCallBack}>Créer et attacher</Button>
      </Modal.Action>
    </Modal>
  )
}
