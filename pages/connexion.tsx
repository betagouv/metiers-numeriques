import { Button } from '@app/atoms/Button'
import { Spacer } from '@app/atoms/Spacer'
import { TextInput } from '@app/atoms/TextInput'
import { Title } from '@app/atoms/Title'
import { theme } from '@app/theme'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

const SideMenu = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${theme.color.primary.darkBlue};
  padding: 2rem;
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
  font-size: 1.5rem;
  line-height: 3rem;
  font-weight: 600;
  color: white;
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

const ErrorMessage = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  color: ${theme.color.danger.scarlet};
  font-weight: 600;
  border-radius: 0.5rem;
  text-align: center;
`

const DEFAULT_SIGN_IN_ERROR_MESSAGE = 'Une erreur est survenue. Merci de réessayer ou de contacter le support.'
const SIGN_IN_ERRORS = {
  Callback: DEFAULT_SIGN_IN_ERROR_MESSAGE,
  CredentialsSignin: 'Identifiants incorrects.',
  Default: DEFAULT_SIGN_IN_ERROR_MESSAGE,
  EmailCreateAccount: 'Un compte existe déjà avec cette adresse email.',
  EmailSignin: DEFAULT_SIGN_IN_ERROR_MESSAGE,
  OAuthAccountNotLinked: 'Ce compte est déjà lié avec une autre adresse email.',
  OAuthCallback: DEFAULT_SIGN_IN_ERROR_MESSAGE,
  OAuthCreateAccount: DEFAULT_SIGN_IN_ERROR_MESSAGE,
  OAuthSignin: DEFAULT_SIGN_IN_ERROR_MESSAGE,
  SessionRequired: 'Vous devez vous connecter pour visiter cette page.',
}

type LoginPageProps = {
  baseUrl: string
  error?: keyof typeof SIGN_IN_ERRORS
}

export default function LoginPage({ baseUrl, error }: LoginPageProps) {
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()

  const callbackUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const url = searchParams.get('callbackUrl') || baseUrl

      return url
    }
  }, [])

  const handleCredentialsSignIn = async () => {
    await signIn('credentials', { callbackUrl, email, password })
  }

  return (
    <div className="fr-container">
      <div className="fr-grid-row">
        <div className="fr-col-md-7 fr-displayed-md fr-p-4v">
          <SideMenu>
            <Image height={340} src="/images/hi-bot.svg" width={340} />
            <WelcomeMessage>Ah, c&apos;est vous !</WelcomeMessage>
          </SideMenu>
        </div>
        <div className="fr-col-md-5 fr-col-12 fr-p-4v">
          <Container>
            <Title as="h1">Se connecter</Title>
            <Spacer units={2} />
            {error && <ErrorMessage>{SIGN_IN_ERRORS[error]}</ErrorMessage>}
            <Spacer units={2} />
            <div style={{ width: '100%' }}>
              <TextInput label="Email" name="email" onChange={e => setEmail(e.target.value)} type="email" />
              <Spacer units={1} />
              <TextInput
                label="Mot de passe"
                name="password"
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%' }}
                type="password"
              />
            </div>
            <Spacer units={2} />

            <LoginButtonContainer>
              <Button onClick={handleCredentialsSignIn} type="submit">
                Se connecter
              </Button>
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
              <div>Vous n&apos;avez pas encore de compte ?</div>
              <Link href="/inscription">
                <Button accent="secondary" size="medium">
                  S&apos;inscrire
                </Button>
              </Link>
            </SubscribeContainer>
            <Spacer units={2} />
          </Container>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const error = query?.error || (query?.callbackUrl && 'SessionRequired') || null

  return { props: { baseUrl: process.env.DOMAIN_URL, error } }
}
