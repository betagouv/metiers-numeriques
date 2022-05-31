import { handleError } from '@common/helpers/handleError'
import ky from 'ky-universal'
import { useCallback, useMemo, useState } from 'react'
import * as Yup from 'yup'

import { cookie, CookieKey } from '../libs/cookie'
import { Form } from '../molecules/Form'

const FormSchema = Yup.object().shape({
  newsletterEmail: Yup.string()
    .required(`Sans addresse e-mail, ça va être compliqué 😅.`)
    .email(`Hmm… il y a comme un soucis avec le format 🤔.`),
})

export function NewsletterBar() {
  const [hasJustSubscribed, setHasJustSubscribed] = useState(false)

  const hasAlreadySubscribed = useMemo(() => cookie.get(CookieKey.HAS_SUBSCRIBED_TO_NEWSLETTER), [])

  const createLead = useCallback(async ({ newsletterEmail }, { setErrors }) => {
    try {
      await ky.post('/api/lead', {
        json: {
          email: newsletterEmail,
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
    }
  }, [])

  if (hasAlreadySubscribed) {
    return null
  }

  return (
    <section className="fr-follow">
      <div className="fr-container">
        <div className="fr-grid-row">
          <div className="fr-col-12">
            <div
              className="fr-follow__newsletter"
              style={{
                alignItems: 'flex-start',
              }}
            >
              {!hasJustSubscribed && (
                <>
                  <div>
                    <p className="fr-h5">Restons en contact</p>
                    <p className="fr-text--sm fr-mb-2w fr-mb-md-0">
                      Laissez-nous votre email pour recevoir l’actualité des métiers numériques dans l’État !
                    </p>
                  </div>
                  <div>
                    <Form initialValues={{}} isInline onSubmit={createLead} validationSchema={FormSchema}>
                      <Form.TextInput
                        aria-describedby="newsletterEmailHelper"
                        autoComplete="email"
                        helper="En renseignant votre adresse électronique, vous acceptez de recevoir nos actualités par
                          courriel. Vous pouvez vous désinscrire à tout moment à l’aide des liens de désinscription ou en
                          nous contactant."
                        isInline
                        label="Votre adresse électronique (ex. : nom@domaine.fr)"
                        name="newsletterEmail"
                        placeholder="Votre adresse électronique (ex. : nom@domaine.fr)"
                        type="email"
                      />
                    </Form>
                  </div>
                </>
              )}

              {hasJustSubscribed && (
                <div>
                  <p className="fr-h5">Plus qu’une dernière étape !</p>
                  <p>Vérifiez votre messagerie pour valider votre abonnement 😉.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
