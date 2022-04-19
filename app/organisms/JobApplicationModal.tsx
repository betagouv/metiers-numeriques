import { handleError } from '@common/helpers/handleError'
import ky from 'ky-universal'
import { useMemo, useState } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside'
import styled from 'styled-components'
import * as Yup from 'yup'

import { cookie, CookieKey } from '../libs/cookie'
import { Form } from '../molecules/Form'

import type { JobWithRelation } from './JobCard'

const Window = styled.div`
  position: relative;
`

const NewsletterBox = styled.div`
  background-color: #f5f5fe;
  flex-direction: column;

  h6 {
    margin: 0;
  }
`

export const FormSchema = Yup.object().shape({
  email: Yup.string()
    .required(`Sans addresse e-mail, ça va être compliqué !`)
    .email(`Hmm… il y a comme un soucis avec le format 🤔.`),
})

type JobApplicationModalProps = {
  job: JobWithRelation
  onDone: Common.FunctionLike
}

export const JobApplicationModal = ({ job, onDone }: JobApplicationModalProps) => {
  const [hasJustSubscribed, setHasJustSubscribed] = useState(false)
  const $window = useDetectClickOutside({ onTriggered: onDone })

  const hasAlreadySubscribed = useMemo(() => cookie.get(CookieKey.HAS_SUBSCRIBED_TO_NEWSLETTER), [])
  const mailtoUrl = useMemo(
    () =>
      `mailto:${job.applicationContacts
        .map(({ email, name }) => `${name}<${email}>`)
        .join(',')}?subject=[metiers.numerique.gouv.fr] Candidature : ${job.title}`,
    [],
  )

  const createLead = async ({ email }, { setErrors }) => {
    try {
      await ky.post('/api/lead', {
        json: {
          email,
          jobId: job.id,
        },
      })

      cookie.set(CookieKey.HAS_SUBSCRIBED_TO_NEWSLETTER, true)

      setHasJustSubscribed(true)
    } catch (err) {
      if (err.name === 'HTTPError') {
        setErrors({
          email: 'Êtes-vous déjà inscrit·e ?',
        })

        return
      }

      handleError(err, 'app/organisms/JobApplicationModal.tsx > createLead()')
    }
  }

  return (
    <dialog aria-labelledby="modal-title" className="fr-modal fr-modal--opened" id="modal">
      <div ref={$window} className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <Window className="fr-modal__body">
              <div
                className="fr-modal__header"
                style={{
                  justifyContent: 'flex-end',
                  position: 'absolute',
                  width: '100%',
                }}
              >
                <button
                  aria-controls="modal"
                  aria-label="Fermer la fenêtre de dialogue"
                  className="fr-link"
                  onClick={onDone}
                  type="button"
                >
                  X
                </button>
              </div>

              <div className="fr-modal__content fr-pb-2w fr-pt-3w">
                <h4 className="fr-modal__title" id="modal-title">
                  {job.title}
                </h4>

                {job.applicationContacts.length > 0 && (
                  <>
                    <p>Un CV sympa et une lettre motivée à :</p>
                    <ul
                      style={{
                        paddingLeft: '1.25rem',
                      }}
                    >
                      {job.applicationContacts.map(({ email, id, name }) => (
                        <li key={id}>
                          {name}
                          <br />
                          {email}
                        </li>
                      ))}
                    </ul>
                    <div
                      className="fr-pt-2w"
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <a className="fr-btn" href={mailtoUrl}>
                        POSTULER VIA MA MESSAGERIE
                      </a>
                    </div>
                  </>
                )}

                {job.applicationWebsiteUrl !== null && (
                  <>
                    <p>
                      Pour postuler à cette offre d’emploi, il vous faut déposer votre candidature sur un portail
                      officiel dédié en suivant le lien ci-dessous :
                    </p>
                    <p
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <a href={job.applicationWebsiteUrl} rel="noreferrer" target="_blank">
                        {job.applicationWebsiteUrl}
                      </a>
                    </p>
                  </>
                )}
              </div>

              {!hasAlreadySubscribed && (
                <NewsletterBox className="fr-modal__footer">
                  {!hasJustSubscribed && (
                    <Form initialValues={{}} onSubmit={createLead} validationSchema={FormSchema}>
                      <Form.TextInput label="E-mail" name="email" type="email" />
                      <Form.Submit>TENEZ-MOI INFORMÉ·E !</Form.Submit>
                    </Form>
                  )}
                  {hasJustSubscribed && (
                    <>
                      <h6>Plus qu’une dernière étape !</h6>
                      <p>Vérifiez votre messagerie pour valider votre abonnement 😉.</p>
                    </>
                  )}
                </NewsletterBox>
              )}
            </Window>
          </div>
        </div>
      </div>
    </dialog>
  )
}
