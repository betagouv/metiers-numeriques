import { useMutation } from '@apollo/client'
import handleError from '@common/helpers/handleError'
import { Button, Field, Modal, TextInput } from '@singularity/core'
import { KeyboardEventHandler, useRef, useState } from 'react'
import * as Yup from 'yup'

import queries from '../queries'

import type { MutationFunctionOptions } from '@apollo/client'
import type { Contact } from '@prisma/client'

const contactSchema = Yup.object().shape({
  email: Yup.string()
    .required(`[email] L’email est obligatoire.`)
    .email(`[email] Cette addresse email est mal formatée.`),
  name: Yup.string().required(`[name] Le nom est obligatoire.`),
})

type NewContactModalProps = {
  onCancel: Common.FunctionLike
  onCreate: (newContactId: string) => void | Promise<void>
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

export const NewContactModal = ({ onCancel, onCreate }: NewContactModalProps) => {
  const $emailInput = useRef<HTMLInputElement>(null)
  const $nameInput = useRef<HTMLInputElement>(null)
  const $phoneInput = useRef<HTMLInputElement>(null)
  const $positionInput = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [createContact] = useMutation(queries.contact.CREATE_ONE)

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

      if (
        $emailInput.current === null ||
        $nameInput.current === null ||
        $phoneInput.current === null ||
        $positionInput.current === null
      ) {
        return
      }

      const input: Partial<Contact> = {
        email: $emailInput.current.value,
        name: $nameInput.current.value,
        phone: $phoneInput.current.value,
        position: $positionInput.current.value,
      }

      await contactSchema.validate(input, {
        abortEarly: false,
      })

      const options: MutationFunctionOptions = {
        variables: {
          input,
        },
      }

      const createContactResult = await createContact(options)

      onCreate(createContactResult.data.createContact.id)
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = makeErrorsFromYupErrors(err.errors)

        setErrors(errors)

        return
      }

      handleError(err, 'app/organisms/NewContactModal() > saveAndCallBack()')
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
        <Modal.Title>Nouveau contact</Modal.Title>

        <Field>
          <TextInput ref={$nameInput} error={errors.name} label="Nom *" onKeyPress={handleKeyPress} />
        </Field>

        <Field>
          <TextInput ref={$positionInput} error={errors.position} label="Poste" onKeyPress={handleKeyPress} />
        </Field>

        <Field>
          <TextInput ref={$emailInput} error={errors.email} label="Email *" onKeyPress={handleKeyPress} type="email" />
        </Field>

        <Field>
          <TextInput ref={$phoneInput} error={errors.phone} label="Téléphone" onKeyPress={handleKeyPress} type="tel" />
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
