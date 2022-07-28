/* eslint-disable sort-keys-fix/sort-keys-fix */
import { Button } from '@app/atoms/Button'
import { Spacer } from '@app/atoms/Spacer'
import { Title } from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import { ActionBar } from '@app/organisms/Profile/ActionBar'
import { JOB_CONTRACT_TYPES_AS_OPTIONS, REGIONS_AS_OPTIONS } from '@common/constants'
import { FormikValues } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const FormSchema = Yup.object().shape({
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'La confirmation du mot de passe doit être identique',
  ),
  email: Yup.string()
    .required(`Sans addresse e-mail, ça va être compliqué !`)
    .email(`Hmm… il y a comme un soucis avec le format 🤔.`),
  password: Yup.string().required('Merci de renseigner votre mot de passe'),
})

type Props = {
  initialValues: FormikValues
  onNext: (values: FormikValues) => void
  onPrevious: () => void
}

export const CredentialsForm = ({ initialValues, onNext, onPrevious }: Props) => (
  <Form initialValues={initialValues} onSubmit={onNext} validationSchema={FormSchema}>
    <Title as="h1">Finalise ton inscription</Title>
    <Spacer units={2} />
    <div className="fr-grid-row fr-grid-row--gutters fr-mb-md-6v fr-mb-3v">
      <div className="fr-col-12">
        <Form.TextInput aria-label="Email" name="email" placeholder="Ton email" />
      </div>
    </div>

    <div className="fr-grid-row fr-grid-row--gutters fr-mb-md-6v fr-mb-3v">
      <div className="fr-col-md-6 fr-col-12">
        <Form.TextInput aria-label="Password" name="password" placeholder="Choisis un mot de passe" type="password" />
      </div>

      <div className="fr-col-md-6 fr-col-12">
        <Form.TextInput
          aria-label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirme le mot de passe"
          type="password"
        />
      </div>
    </div>

    <ActionBar className="fr-pt-md-16v">
      <Button accent="secondary" onClick={onPrevious}>
        Retour
      </Button>
      <Form.Submit>Valider</Form.Submit>
    </ActionBar>
  </Form>
)
