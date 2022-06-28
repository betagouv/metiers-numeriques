import { Title } from '@app/atoms/Title'
import { cookie, CookieKey } from '@app/libs/cookie'
import { Form } from '@app/molecules/Form'
import { handleError } from '@common/helpers/handleError'
import ky from 'ky-universal'
import Image from 'next/image'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import * as Yup from 'yup'

import type { FormikHelpers, FormikValues } from 'formik'

const FormSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required(`Sans addresse e-mail, ça va être compliqué 😅.`)
    .email(`Hmm… il y a comme un soucis avec le format 🤔.`),
})

const Box = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 2rem 0;
`

const Picture = styled.div`
  display: none;

  @media screen and (min-width: 768px) {
    display: flex;
  }
`

const Content = styled.div`
  @media screen and (min-width: 768px) {
    width: 50%;
  }
`

const Text = styled.p`
  /* color: #000f9f; */
  /* font-size: 185%; */
  /* font-weight: 900; */
  line-height: 1.25;
`

const StyledForm = styled(Form)`
  align-items: flex-start;
  display: flex;
  margin-top: 3rem;

  > .TextInput {
    flex-grow: 1;
  }
  > .Button {
    margin-left: 1rem;
  }
`

export function NewsletterBar() {
  const [hasJustSubscribed, setHasJustSubscribed] = useState(false)

  const hasAlreadySubscribed = useMemo(() => cookie.get(CookieKey.HAS_SUBSCRIBED_TO_NEWSLETTER), [])

  const createLead = useCallback(async ({ email }: FormikValues, { setErrors }: FormikHelpers<FormikValues>) => {
    try {
      await ky.post('/api/lead', {
        json: {
          email,
        },
      })

      cookie.set(CookieKey.HAS_SUBSCRIBED_TO_NEWSLETTER, true)

      setHasJustSubscribed(true)
    } catch (err: any) {
      if (err.name === 'HTTPError') {
        setErrors({
          email: 'Êtes-vous déjà inscrit·e ?',
        })

        return
      }

      handleError(err, 'app/organisms/NewletterBar.tsx > createLead()')
    } finally {
      setErrors({})
    }
  }, [])

  if (hasAlreadySubscribed) {
    return null
  }

  return (
    <Box>
      <Picture>
        <Image height="362" layout="intrinsic" src="/images/newsletter-bar-illu.svg" width="537" />
      </Picture>

      <Content>
        {!hasJustSubscribed && (
          <>
            {' '}
            <Title as="h2">On reste en contact ?</Title>
            <Text>
              Laisse-nous ton adresse mail ci-dessous et reçois des informations sur les métiers du numériques au sein
              de l’État. Promis on ne te spammera pas !
            </Text>
            <StyledForm initialValues={{}} isInline onSubmit={createLead} validationSchema={FormSchema}>
              <Form.TextInput aria-label="Adresse email" name="email" placeholder="tim.berners-lee@w3c.org" />
              <Form.Submit>S’inscrire</Form.Submit>
            </StyledForm>
          </>
        )}

        {hasJustSubscribed && (
          <div>
            <Title as="h2">Plus qu’une dernière étape !</Title>
            <Text>Vérifiez votre messagerie pour valider votre abonnement 😉.</Text>
          </div>
        )}
      </Content>
    </Box>
  )
}
