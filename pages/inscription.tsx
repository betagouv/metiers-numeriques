import { Button } from '@app/atoms/Button'
import { Radio } from '@app/atoms/Radio'
import { Spacer } from '@app/atoms/Spacer'
import { Title } from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import { theme } from '@app/theme'
import { FormikValues } from 'formik'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import styled from 'styled-components'
import * as Yup from 'yup'
import YupPassword from 'yup-password'

const SideMenu = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${theme.color.primary.darkBlue};
  padding: 0 4rem 4rem;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`

const AlternativeLogin = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;

  > button {
    width: 50%;
  }
`

const WelcomeMessage = styled.div`
  h2 {
    color: white;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 600;
    margin-bottom: 0;
  }

  color: white;
  font-size: 1rem;
  line-height: 1.5rem;
  text-align: center;
  max-width: 400px;
`

const RadioGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 0 2rem;
`

const LoginButtonContainer = styled.div`
  width: 100%;
  justify-content: center;
  padding: 0 2rem;

  > button {
    width: 100%;
    justify-content: center;
  }
`

const OrContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  > span {
    z-index: 1;
    color: ${theme.color.primary.darkBlue};
    background-color: white;
    padding: 1rem;
  }
`

const Stroke = styled.div`
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: ${theme.color.primary.darkBlue};
`

const SubscribeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  gap: 1rem;

  > button {
    width: 100%;
  }
`

YupPassword(Yup) // extend yup for password handling
const PASSWORD_RULES =
  'Le mot de passe doit contenir au moins 8 caractères, 1 lettre majuscule, 1 lettre miniscule et 1 caractère spécial.'

const FormSchema = Yup.object().shape({
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'La confirmation du mot de passe doit être identique',
  ),
  email: Yup.string()
    .required(`Sans addresse e-mail, ça va être compliqué !`)
    .email(`Hmm… il y a comme un soucis avec le format 🤔.`),
  firstName: Yup.string().required('Votre prénom doit être renseigné'),
  lastName: Yup.string().required('Votre nom doit être renseigné'),
  password: Yup.string()
    .required('Merci de renseigner votre mot de passe')
    .min(8, PASSWORD_RULES)
    .minLowercase(1, PASSWORD_RULES)
    .minUppercase(1, PASSWORD_RULES)
    .minSymbols(1, PASSWORD_RULES),
})

export default function SubscriptionPage() {
  const [isRecruiter, setIsRecruiter] = useState(false)
  const [isEmailSignUp, setIsEmailSignUp] = useState(false)

  // Redirects to the profile page after signup
  const callbackUrl = isRecruiter ? '/demande-de-compte' : '/profil'

  const handleEmailSignUp = async (values: FormikValues) => {
    const signUpValues = { ...values, isRecruiter }
    const signUpResponse = await fetch('/api/auth/signup', { body: JSON.stringify(signUpValues), method: 'POST' })
    if (signUpResponse.status === 200) {
      await signIn('credentials', { callbackUrl, email: values.email, password: values.password })
    }
  }

  return (
    <div className="fr-container">
      <div className="fr-grid-row">
        <div className="fr-col-md-7 fr-displayed-md fr-p-4v">
          <SideMenu>
            <Image height="500" layout="intrinsic" src="/images/rocket.svg" width="500" />
            <WelcomeMessage>
              <h2>Bienvenue chez nous !</h2>
              <br />
              Inscris-toi pour candidater à nos offres et suit ta candidature dans ton espace.
            </WelcomeMessage>
          </SideMenu>
        </div>
        <div className="fr-col-md-5 fr-col-12 fr-p-4v">
          <Container>
            <Title as="h1">S&apos;inscrire</Title>
            <Spacer units={2} />

            <RadioGroup>
              <Radio checked={!isRecruiter} label="Candidat" onChange={() => setIsRecruiter(false)} />
              <Radio checked={isRecruiter} label="Employeur public" onChange={() => setIsRecruiter(true)} />
            </RadioGroup>
            <Spacer units={3} />

            {isEmailSignUp ? (
              <Form initialValues={{}} onSubmit={handleEmailSignUp} validationSchema={FormSchema}>
                <Form.TextInput label="Prénom" name="firstName" placeholder="John" />
                <Spacer units={1} />
                <Form.TextInput label="Nom" name="lastName" placeholder="Doe" />
                <Spacer units={1} />
                <Form.TextInput label="Email" name="email" placeholder="john.doe@gouv.fr" type="email" />
                <Spacer units={1} />
                <Form.TextInput label="Mot de passe" name="password" placeholder="••••••" type="password" />
                <Spacer units={1} />
                <Form.TextInput
                  label="Confirmer le mot de passe"
                  name="confirmPassword"
                  placeholder="••••••"
                  type="password"
                />
                <Spacer units={2} />
                <div className="fr-grid-row fr-grid-row--gutters">
                  <div className="fr-col-8">
                    <Form.Submit style={{ width: '100%' }}>S&apos;inscrire</Form.Submit>
                  </div>
                  <div className="fr-col-4">
                    <Button accent="secondary" onClick={() => setIsEmailSignUp(false)}>
                      Retour
                    </Button>
                  </div>
                </div>
              </Form>
            ) : (
              <>
                <LoginButtonContainer>
                  <Button onClick={() => setIsEmailSignUp(true)}>S&apos;inscrire par email</Button>
                  <OrContainer>
                    <Stroke />
                    <span>Ou</span>
                  </OrContainer>
                  <AlternativeLogin>
                    <Button
                      accent="secondary"
                      iconClassName="ri-google-fill"
                      onClick={() => signIn('google', { callbackUrl })}
                      size="medium"
                    >
                      Google
                    </Button>
                    <Button
                      accent="secondary"
                      iconClassName="ri-linkedin-fill"
                      onClick={() => signIn('linkedin', { callbackUrl })}
                      size="medium"
                    >
                      LinkedIn
                    </Button>
                  </AlternativeLogin>
                </LoginButtonContainer>
                <Spacer units={3} />
                <SubscribeContainer>
                  <div>Vous avez déjà un compte ?</div>
                  <Link href="/connexion">
                    <Button accent="secondary" size="medium">
                      Se connecter
                    </Button>
                  </Link>
                </SubscribeContainer>
              </>
            )}

            <Spacer units={2} />
          </Container>
        </div>
      </div>
    </div>
  )
}
