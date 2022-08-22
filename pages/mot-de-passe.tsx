import { Button } from '@app/atoms/Button'
import { LinkLikeButton } from '@app/atoms/LinkLikeButton'
import { Spacer } from '@app/atoms/Spacer'
import { TextInput } from '@app/atoms/TextInput'
import { Title } from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import { ProfileLayout } from '@app/organisms/Profile/ProfileLayout'
import { handleError } from '@common/helpers/handleError'
import { FormikValues } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import YupPassword from 'yup-password'

type ChangePasswordStep = 'email-request' | 'email-sent' | 'password-reset' | 'password-changed'

type ResetPasswordPageProps = { resetToken?: string }

YupPassword(Yup) // extend yup for password handling
const PASSWORD_RULES =
  'Le mot de passe doit contenir au moins 8 caractères, 1 lettre majuscule, 1 lettre miniscule et 1 caractère spécial.'

const ResetPasswordFormSchema = Yup.object().shape({
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'La confirmation du mot de passe doit être identique',
  ),
  password: Yup.string()
    .required('Merci de renseigner votre mot de passe')
    .min(8, PASSWORD_RULES)
    .minLowercase(1, PASSWORD_RULES)
    .minUppercase(1, PASSWORD_RULES)
    .minSymbols(1, PASSWORD_RULES),
})

export default function ResetPasswordPage({ resetToken }: ResetPasswordPageProps) {
  const [step, setStep] = useState<ChangePasswordStep>(resetToken ? 'password-reset' : 'email-request')
  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState<string>()

  const handleForgotPasswordRequest = async () => {
    try {
      setIsLoading(true)
      await fetch('/api/auth/forgot-password', { body: JSON.stringify({ email }), method: 'POST' })
    } catch (err) {
      handleError(err, 'pages/mot-de-passe.tsx > query.handleForgotPasswordRequest()')
    } finally {
      setIsLoading(false)
      setStep('email-sent')
    }
  }

  const handleResetPassword = async (values: FormikValues) => {
    try {
      await fetch('/api/auth/reset-password', { body: JSON.stringify(values), method: 'POST' })
    } catch (err) {
      handleError(err, 'pages/mot-de-passe.tsx > query.handleResetPassword()')
    } finally {
      setStep('password-changed')
    }
  }

  return (
    <ProfileLayout>
      {step === 'email-request' && (
        <>
          <Title as="h1">Mot de passe oublié ?</Title>
          <Spacer units={2} />
          <div>
            Tu as oublié ton mot de passe ? Pas de problème, indique-nous ton email de connexion et nous tu recevras un
            lien de réinitialisation.
          </div>
          <Spacer units={2} />
          <TextInput
            disabled={isLoading}
            label="Email"
            name="email"
            onChange={e => setEmail(e.target.value)}
            placeholder="john@doe.com"
          />
          <Spacer units={1} />
          <Button disabled={isLoading} onClick={handleForgotPasswordRequest}>
            Envoyer
          </Button>
        </>
      )}
      {step === 'email-sent' && (
        <>
          <Title as="h1">Email envoyé !</Title>
          <Spacer units={2} />
          <div>Consulte ta messagerie pour réinitialiser ton mot de passe.</div>
        </>
      )}
      {step === 'password-reset' && (
        <>
          <Title as="h1">Réinitilisation du mot de passe</Title>
          <Spacer units={2} />
          <Form
            initialValues={{ resetToken }}
            onSubmit={handleResetPassword}
            validationSchema={ResetPasswordFormSchema}
          >
            <Form.TextInput
              disabled={isLoading}
              label="Nouveau mot de passe"
              name="password"
              placeholder="••••••"
              type="password"
            />
            <Spacer units={1} />
            <Form.TextInput
              disabled={isLoading}
              label="Confirmer le mot de passe"
              name="confirmPassword"
              placeholder="••••••"
              type="password"
            />
            <Spacer units={1} />
            <Form.Submit>Envoyer</Form.Submit>
          </Form>
        </>
      )}
      {step === 'password-changed' && (
        <>
          <Title as="h1">Mot de passe réinitialisé !</Title>
          <Spacer units={2} />
          <div>Ton mot de passe a bien été réinitialisé.</div>
          <Spacer units={2} />
          <LinkLikeButton href="/connexion">Me connecter</LinkLikeButton>
        </>
      )}
      <Spacer units={3} />
    </ProfileLayout>
  )
}

export async function getServerSideProps({ query }) {
  const resetToken = query?.resetToken || null

  return { props: { resetToken } }
}
