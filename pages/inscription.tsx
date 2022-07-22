import { Button } from '@app/atoms/Button'
import { Spacer } from '@app/atoms/Spacer'
import { Title } from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import { theme } from '@app/theme'
import { JOB_CONTRACT_TYPES_AS_OPTIONS, REGIONS_AS_OPTIONS } from '@common/constants'
import { JobContractType } from '@prisma/client'
import { FormikHelpers, FormikValues } from 'formik'
import Image from 'next/image'
import React, { useState } from 'react'
import styled from 'styled-components'
import * as Yup from 'yup'

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const SideBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: ${theme.color.primary.darkBlue};
  width: 300px;
`

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
`

type SubscriptionStep = 'profile' | 'preferences' | 'credentials'

export const FormSchema = Yup.object().shape({
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'La confirmation du mot de passe doit être identique',
  ),
  contractTypes: Yup.array(Yup.string().nullable())
    .required(`Au moins un type de contrat est obligatoire.`)
    .min(1, `Au moins un type de contrat est obligatoire.`),
  currentJob: Yup.string().required('Ce champ est obligatoire'),
  domainIds: Yup.array(Yup.string().nullable())
    .required(`Au moins un domaine est obligatoire.`)
    .min(1, `Au moins un domaine est obligatoire.`),
  email: Yup.string()
    .required(`Sans addresse e-mail, ça va être compliqué !`)
    .email(`Hmm… il y a comme un soucis avec le format 🤔.`),
  firstName: Yup.string().required('Ce champ est obligatoire'),
  githubUrl: Yup.string().url('Cette URL est mal formatée.'),
  hiddenFromInstitutions: Yup.array(Yup.string().nullable()).nullable(),
  lastName: Yup.string().required('Ce champ est obligatoire'),
  password: Yup.string().required('Merci de renseigner votre mot de passe'),
  portfolioUrl: Yup.string().url('Cette URL est mal formatée.'),
  region: Yup.string().required('Ce champ est obligatoire'),
  yearsOfExperience: Yup.number().required('Ce champ est obligatoire'),
})

export default function SubscriptionPage() {
  const [step, setStep] = useState<SubscriptionStep>('profile')

  const handlePreviousStep = () => {
    if (step === 'preferences') {
      setStep('profile')
    }
    if (step === 'credentials') {
      setStep('preferences')
    }
  }

  const handleNextStep = () => {
    if (step === 'profile') {
      setStep('preferences')
    }
    if (step === 'preferences') {
      setStep('credentials')
    }
  }

  const handleSubmit = (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>) => {
    console.log('submit', values)
  }

  return (
    <div className="fr-container fr-pt-4w fr-pb-8w fr-grid-row">
      <SideBar className="fr-col-md-3 fr-displayed-md fr-p-4v">
        <Image height="200" layout="intrinsic" src="/images/rocket.svg" width="200" />
      </SideBar>
      <div className="fr-col-md-9 fr-col-12 fr-px-md-24v fr-py-md-6v">
        <PageContent>
          <Form initialValues={{}} onSubmit={handleSubmit} validationSchema={FormSchema}>
            {step === 'profile' && (
              <div>
                <Title as="h1">Ton Profil 1/2</Title>
                <Spacer units={2} />
                <div className="fr-grid-row fr-grid-row--gutters fr-mb-md-6v fr-mb-3v">
                  <div className="fr-col-md-6 fr-col-12">
                    <Form.TextInput aria-label="Prénom" name="firstName" placeholder="Prénom" />
                  </div>
                  <div className="fr-col-md-6 fr-col-12">
                    <Form.TextInput aria-label="Nom" name="lastName" placeholder="Nom" />
                  </div>
                </div>

                <div className="fr-grid-row fr-grid-row--gutters fr-mb-md-6v fr-mb-3v">
                  <div className="fr-col-md-6 fr-col-12">
                    <div>Ce que tu fais</div>
                    <Form.TextInput aria-label="Métier" name="currentJob" placeholder="Métier" />
                  </div>
                  <div className="fr-col-md-6 fr-col-12 fr-mt-md-5v">
                    <Form.TextInput
                      aria-label="Années d'expérience"
                      name="yearsOfExperience"
                      placeholder="Années d'expérience"
                      type="number"
                    />
                  </div>
                </div>

                <div className="fr-grid-row fr-grid-row--gutters fr-mb-6v">
                  <div className="fr-col-md-6 fr-col-12">
                    <Form.TextInput
                      aria-label="Profil GitHub"
                      iconClassName="ri-github-fill"
                      label="Comment tu le fais"
                      name="githubUrl"
                      placeholder="Profil GitHub"
                    />
                  </div>
                  <div className="fr-col-md-6 fr-col-12 fr-mt-md-5v">
                    <Form.TextInput
                      aria-label="Portfolio"
                      iconClassName="ri-link-m"
                      name="portfolioUrl"
                      placeholder="Portfolio"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'preferences' && (
              <div>
                <Title as="h1">Ton Profil 2/2</Title>
                <Spacer units={2} />
                <div className="fr-grid-row fr-grid-row--gutters fr-mb-md-6v fr-mb-3v">
                  <div className="fr-col-md-6 fr-col-12">
                    <Form.Select
                      aria-label="Domaines"
                      isMulti
                      label="Domaines qui m'intéressent"
                      name="domainIds"
                      placeholder="Ecologie, Education, Justice"
                    />
                  </div>
                  <div className="fr-col-md-6 fr-col-12">
                    <Form.Select
                      aria-label="Hidden Institutions"
                      isMulti
                      label="Ne pas envoyer ma candidature à ces institutions"
                      name="hiddenFromInstitutions"
                    />
                  </div>
                </div>

                <div className="fr-grid-row fr-grid-row--gutters fr-mb-md-6v fr-mb-3v">
                  <div className="fr-col-md-6 fr-col-12">
                    <Form.Select
                      label="Localisation"
                      name="region"
                      options={REGIONS_AS_OPTIONS}
                      placeholder="Normandie"
                    />
                  </div>
                </div>

                <div className="fr-grid-row fr-grid-row--gutters fr-mb-6v">
                  <div className="fr-col-md-6 fr-col-12">
                    <Form.Select
                      label="Type de contrat recherché"
                      name="contractTypes"
                      options={JOB_CONTRACT_TYPES_AS_OPTIONS}
                      placeholder="Fonctionnaire, Contractuel"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'credentials' && (
              <div>
                <Title as="h1">Finalise ton inscription</Title>
                <Spacer units={2} />
                <div className="fr-grid-row fr-grid-row--gutters fr-mb-md-6v fr-mb-3v">
                  <div className="fr-col-12">
                    <Form.TextInput aria-label="Email" name="email" placeholder="Ton email" />
                  </div>
                </div>

                <div className="fr-grid-row fr-grid-row--gutters fr-mb-md-6v fr-mb-3v">
                  <div className="fr-col-md-6 fr-col-12">
                    <Form.TextInput
                      aria-label="Password"
                      name="password"
                      placeholder="Choisis un mot de passe"
                      type="password"
                    />
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
              </div>
            )}

            <ActionBar className="fr-pt-md-16v">
              {step !== 'profile' && (
                <Button accent="secondary" onClick={handlePreviousStep}>
                  Retour
                </Button>
              )}
              {step === 'credentials' ? (
                <Form.Submit>S'inscrire</Form.Submit>
              ) : (
                <Button onClick={handleNextStep}>Valider</Button>
              )}
            </ActionBar>
          </Form>
        </PageContent>
      </div>
    </div>
  )
}
