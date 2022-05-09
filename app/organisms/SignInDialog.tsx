import { ButtonAsLink } from '@app/atoms/ButtonAsLink'
import { handleError } from '@common/helpers/handleError'
import { Dialog, Field } from '@singularity/core'
import { NexauthError, useAuth } from 'nexauth/client'
import { useState } from 'react'
import * as Yup from 'yup'

import { AdminForm } from '../molecules/AdminForm'

import type { FormikHelpers } from 'formik'

type LogInValues = {
  logInEmail: string
  logInPassword: string
}
type SignUpValues = {
  signUpEmail: string
  signUpFirstName: string
  signUpLastName: string
  signUpPassword: string
  signUpPasswordConfirmation: string
}

export enum SignInDialogType {
  LOG_IN = 'LOG_IN',
  SIGN_UP = 'SIGN_UP',
}

const logInFormSchema = Yup.object().shape({
  logInEmail: Yup.string().required(`Veuillez entrer votre email.`).email(`Votre addresse email est mal formatée.`),
  logInPassword: Yup.string().required(`Veuillez entrer votre mot de passe.`),
})

const signUpFormSchema = Yup.object().shape({
  signUpEmail: Yup.string().required(`Veuillez entrer votre email.`).email(`Votre addresse email est mal formatée.`),
  signUpFirstName: Yup.string().required(`Veuillez entrer votre prénom.`),
  signUpLastName: Yup.string().required(`Veuillez entrer votre nom.`),
  signUpPassword: Yup.string().required(`Veuillez entrer un mot de passe.`),
  signUpPasswordConfirmation: Yup.string()
    .required(`Veuillez répéter le mot de passe.`)
    .oneOf([Yup.ref('signUpPassword'), null], 'Les mots de passe ne correspondent pas.'),
})

type SignInDialogProps = {
  defaultType?: SignInDialogType
}
export default function SignInDialog({ defaultType = SignInDialogType.LOG_IN }: SignInDialogProps) {
  const [type, setType] = useState(defaultType)
  const auth = useAuth()

  const logIn = async (values: LogInValues, { setErrors, setSubmitting }: FormikHelpers<LogInValues>) => {
    try {
      const { logInEmail, logInPassword } = values

      const res = await auth.logIn(logInEmail, logInPassword)
      if (res.isError) {
        if (res.error.email !== undefined) {
          switch (res.error.email) {
            case NexauthError.LOG_IN_WRONG_EMAIL_OR_PASSWORD:
              setErrors({
                logInEmail: 'Mauvais email et/ou mot de passe.',
              })
              break

            case NexauthError.LOG_IN_UNACCEPTABLE_CONDITION:
              setErrors({
                logInEmail: 'Votre compte n’a pas encore été activé.',
              })
              break

            default:
              // eslint-disable-next-line no-console
              console.error(res.error)
          }
        }

        setSubmitting(false)
      }
    } catch (err) {
      handleError(err, 'pages/admin/signin.js:validateForm()')
    }
  }

  const signUp = async (values: SignUpValues, { setErrors, setSubmitting }: FormikHelpers<SignUpValues>) => {
    const {
      signUpEmail: email,
      signUpFirstName: firstName,
      signUpLastName: lastName,
      signUpPassword: password,
    } = values

    const res = await auth.signUp({
      email,
      firstName,
      lastName,
      password,
    })
    if (res.isError) {
      if (res.error.email !== undefined) {
        switch (res.error.email) {
          case NexauthError.SIGN_UP_DUPLICATE_EMAIL:
            setErrors({
              signUpEmail: 'Cette adresse email est déjà associée à un compte.',
            })
            break

          default:
            // eslint-disable-next-line no-console
            console.error(res.error)
        }
      } else {
        // eslint-disable-next-line no-console
        console.error(res.error)
      }

      setSubmitting(false)

      return
    }

    switchToLogIn()
  }

  const switchToLogIn = () => {
    setType(SignInDialogType.LOG_IN)
  }

  const switchToSignUp = () => {
    setType(SignInDialogType.SIGN_UP)
  }

  if (type === SignInDialogType.LOG_IN) {
    return (
      <Dialog>
        <AdminForm
          key="logIn.form"
          autoComplete="on"
          initialValues={{}}
          onSubmit={logIn}
          validationSchema={logInFormSchema}
        >
          <Dialog.Body>
            <Dialog.Title>Connexion</Dialog.Title>

            <p>
              Veuillez{' '}
              <ButtonAsLink onClick={switchToSignUp} type="button">
                demander un compte
              </ButtonAsLink>{' '}
              si vous n’en avez pas.
            </p>

            <Field>
              <AdminForm.TextInput autoComplete="email" label="Email" name="logInEmail" type="email" />
            </Field>
            <Field>
              <AdminForm.TextInput
                autoComplete="current-password"
                label="Mot de passe"
                name="logInPassword"
                type="password"
              />
            </Field>
          </Dialog.Body>

          <Dialog.Action>
            <AdminForm.Submit>Se connecter</AdminForm.Submit>
          </Dialog.Action>
        </AdminForm>
      </Dialog>
    )
  }

  return (
    <Dialog>
      <AdminForm
        key="signUp.form"
        autoComplete="on"
        initialValues={{}}
        onSubmit={signUp}
        validationSchema={signUpFormSchema}
      >
        <Dialog.Body>
          <Dialog.Title>Demande de création d’un compte</Dialog.Title>

          <p>
            Veuillez{' '}
            <ButtonAsLink onClick={switchToLogIn} type="button">
              vous connecter
            </ButtonAsLink>{' '}
            si vous avez déjà un compte.
          </p>

          <Field>
            <AdminForm.TextInput autoComplete="email" label="Email" name="signUpEmail" type="email" />
          </Field>
          <Field>
            <AdminForm.TextInput
              autoComplete="new-password"
              label="Mot de passe"
              name="signUpPassword"
              type="password"
            />
          </Field>
          <Field>
            <AdminForm.TextInput
              autoComplete="new-password"
              label="Mot de passe (répêter)"
              name="signUpPasswordConfirmation"
              type="password"
            />
          </Field>
          <Field>
            <AdminForm.TextInput autoComplete="given-name" label="Prénom" name="signUpFirstName" />
          </Field>
          <Field>
            <AdminForm.TextInput autoComplete="family-name" label="Nom" name="signUpLastName" />
          </Field>
        </Dialog.Body>

        <Dialog.Action>
          <AdminForm.Submit>Envoyer ma demande</AdminForm.Submit>
        </Dialog.Action>
      </AdminForm>
    </Dialog>
  )
}
