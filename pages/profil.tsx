import { prisma } from '@api/libs/prisma'
import { CheckOffers } from '@app/organisms/Profile/CheckOffers'
import { PreferencesForm } from '@app/organisms/Profile/PreferencesForm'
import { ProfileForm } from '@app/organisms/Profile/ProfileForm'
import { theme } from '@app/theme'
import { JobContractType } from '@prisma/client'
import { getToken } from 'next-auth/jwt'
import Image from 'next/image'
import * as R from 'ramda'
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

type ProfileStep = 'profile' | 'preferences' | 'check-offers'

type Profile = {
  contractTypes: JobContractType[]
  currentJob: string
  domainIds: string[]
  firstName: string
  githubUrl?: string
  hiddenFromInstitutions: string[]
  lastName: string
  linkedInUrl: string
  phone?: string
  portfolioUrl?: string
  region: string
  seniorityInYears: string
}

type ProfilePageProps = {
  profile: Profile
}

export default function ProfilePage({ profile }: ProfilePageProps) {
  const [step, setStep] = useState<ProfileStep>('profile')
  const subscriptionValues = useRef(profile)

  const handlePreviousStep = () => {
    if (step === 'preferences') {
      setStep('profile')
    }
    if (step === 'check-offers') {
      setStep('preferences')
    }
  }

  const handleNextStep = async values => {
    subscriptionValues.current = { ...subscriptionValues.current, ...values }
    if (step === 'profile') {
      setStep('preferences')
    }
    if (step === 'preferences') {
      setStep('check-offers')
      await fetch('/api/auth/profile', { body: JSON.stringify(values), method: 'PUT' })
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

          {step === 'check-offers' && <CheckOffers />}
        </PageContent>
      </div>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const auth = await getToken({ req })

  if (!auth) {
    return {
      redirect: {
        destination: '/connexion',
        permanent: false,
      },
    }
  }

  const user = await prisma.user.findUnique({
    include: {
      candidate: {
        include: {
          domains: true,
          hiddenFromInstitutions: true,
          professions: true,
        },
      },
    },
    where: { id: auth.sub },
  })

  if (!user) {
    return {
      redirect: {
        destination: '/connexion',
        permanent: false,
      },
    }
  }

  const userProfile = R.pick(['firstName', 'lastName'])(user)
  const candidateProfile = R.pick([
    'currentJob',
    'region',
    'seniorityInYears',
    'phone',
    'linkedInUrl',
    'contractTypes',
    'portfolioUrl',
    'githubUrl',
  ])(user.candidate || {})
  const nestCandidateProfileProps = {
    domainIds: user?.candidate?.domains?.map(domain => domain.id) || [],
    hiddenFromInstitutions: user?.candidate?.hiddenFromInstitutions?.map(institution => institution.id) || [],
    professionIds: user?.candidate?.professions?.map(profession => profession.id) || [],
  }

  const profile = { ...userProfile, ...candidateProfile, ...nestCandidateProfileProps }

  return { props: { profile } }
}
