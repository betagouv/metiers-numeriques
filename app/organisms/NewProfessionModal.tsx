import { useMutation } from '@apollo/client'
import handleError from '@common/helpers/handleError'
import { Button, Field, Modal, TextInput } from '@singularity/core'
import { KeyboardEventHandler, useRef, useState } from 'react'
import * as Yup from 'yup'

import queries from '../queries'

import type { MutationFunctionOptions } from '@apollo/client'
import type { Profession } from '@prisma/client'

const professionSchema = Yup.object().shape({
  name: Yup.string().required(`[name] Le nom est obligatoire.`),
})

type NewProfessionModalProps = {
  onCancel: Common.FunctionLike
  onCreate: (newProfessionId: string) => void | Promise<void>
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

export const NewProfessionModal = ({ onCancel, onCreate }: NewProfessionModalProps) => {
  const $nameInput = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [createProfession] = useMutation(queries.profession.CREATE_ONE)

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

      if ($nameInput.current === null) {
        return
      }

      const input: Partial<Profession> = {
        name: $nameInput.current.value,
      }

      await professionSchema.validate(input, {
        abortEarly: false,
      })

      const options: MutationFunctionOptions = {
        variables: {
          input,
        },
      }

      const createProfessionResult = await createProfession(options)

      onCreate(createProfessionResult.data.createProfession.id)
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = makeErrorsFromYupErrors(err.errors)

        setErrors(errors)

        return
      }

      handleError(err, 'app/organisms/NewProfessionModal() > saveAndCallBack()')
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
        <Modal.Title>Nouveau métier</Modal.Title>

        <Field>
          <TextInput ref={$nameInput} error={errors.name} label="Nom *" onKeyPress={handleKeyPress} />
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
