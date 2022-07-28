import { Button } from '@app/atoms/Button'
import { Spacer } from '@app/atoms/Spacer'
import { TextInput } from '@app/atoms/TextInput'
import { Title } from '@app/atoms/Title'
import { theme } from '@app/theme'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
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

export default function LoginPage({ baseUrl }) {
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
            <WelcomeMessage>Ah, c'est vous !</WelcomeMessage>
          </SideMenu>
        </div>
        <div className="fr-col-md-5 fr-col-12 fr-p-4v">
          <Title as="h1">Se connecter</Title>
          <Spacer units={4} />
          <TextInput label="Email" name="email" onChange={e => setEmail(e.target.value)} type="email" />
          <Spacer units={1} />
          <TextInput label="Mot de passe" name="password" onChange={e => setPassword(e.target.value)} type="password" />
          <Spacer units={2} />

          <LoginButtonContainer>
            <Button onClick={handleCredentialsSignIn}>Se connecter</Button>
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
          <Spacer units={4} />
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  return { props: { baseUrl: process.env.DOMAIN_URL } }
}
