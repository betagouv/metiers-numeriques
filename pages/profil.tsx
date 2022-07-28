import { CredentialsForm } from '@app/organisms/Profile/CredentialsForm'
import { PreferencesForm } from '@app/organisms/Profile/PreferencesForm'
import { ProfileForm } from '@app/organisms/Profile/ProfileForm'
import { theme } from '@app/theme'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'

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

type ProfileStep = 'profile' | 'preferences' | 'credentials'

export default function ProfilePage() {
  const [step, setStep] = useState<ProfileStep>('profile')
  const subscriptionValues = useRef({})

  const handlePreviousStep = () => {
    if (step === 'preferences') {
      setStep('profile')
    }
    if (step === 'credentials') {
      setStep('preferences')
    }
  }

  const handleNextStep = async values => {
    subscriptionValues.current = { ...subscriptionValues.current, ...values }
    if (step === 'profile') {
      setStep('preferences')
    }
    if (step === 'preferences') {
      setStep('credentials')
    }
    if (step === 'credentials') {
      fetch('/api/auth/signup', { body: JSON.stringify(values), method: 'POST' })
    }
  }

  return (
    <div className="fr-container fr-pt-4w fr-pb-8w fr-grid-row">
      <SideBar className="fr-col-md-3 fr-displayed-md fr-p-4v">
        <Image height="200" layout="intrinsic" src="/images/rocket.svg" width="200" />
      </SideBar>
      <div className="fr-col-md-9 fr-col-12 fr-px-md-24v fr-py-md-6v">
        <PageContent>
          {step === 'profile' && <ProfileForm initialValues={subscriptionValues.current} onNext={handleNextStep} />}

          {step === 'preferences' && (
            <PreferencesForm
              initialValues={subscriptionValues.current}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
            />
          )}

          {step === 'credentials' && (
            <CredentialsForm
              initialValues={subscriptionValues.current}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
            />
          )}
        </PageContent>
      </div>
    </div>
  )
}
