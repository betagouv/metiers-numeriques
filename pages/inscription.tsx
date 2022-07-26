import { CredentialsForm } from '@app/organisms/Subscription/CredentialsForm'
import { PreferencesForm } from '@app/organisms/Subscription/PreferencesForm'
import { ProfileForm } from '@app/organisms/Subscription/ProfileForm'
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

type SubscriptionStep = 'profile' | 'preferences' | 'credentials'

export default function SubscriptionPage() {
  const [step, setStep] = useState<SubscriptionStep>('profile')
  const subscriptionValues = useRef({})

  const handlePreviousStep = () => {
    if (step === 'preferences') {
      setStep('profile')
    }
    if (step === 'credentials') {
      setStep('preferences')
    }
  }

  const handleNextStep = values => {
    subscriptionValues.current = { ...subscriptionValues.current, ...values }
    if (step === 'profile') {
      console.log(values, subscriptionValues.current)
      setStep('preferences')
    }
    if (step === 'preferences') {
      console.log(values, subscriptionValues.current)
      setStep('credentials')
    }
    if (step === 'credentials') {
      console.log(values, subscriptionValues.current)
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
