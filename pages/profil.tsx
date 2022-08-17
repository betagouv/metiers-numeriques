import { prisma } from '@api/libs/prisma'
import { CheckOffers } from '@app/organisms/Profile/CheckOffers'
import { PreferencesForm } from '@app/organisms/Profile/PreferencesForm'
import { ProfileForm } from '@app/organisms/Profile/ProfileForm'
import { ProfileLayout } from '@app/organisms/Profile/ProfileLayout'
import { JobContractType } from '@prisma/client'
import { getSession } from 'next-auth/react'
import * as R from 'ramda'
import React, { useRef, useState } from 'react'

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
    <ProfileLayout>
      {step === 'profile' && <ProfileForm initialValues={subscriptionValues.current} onNext={handleNextStep} />}

      {step === 'preferences' && (
        <PreferencesForm
          initialValues={subscriptionValues.current}
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
        />
      )}

      {step === 'check-offers' && <CheckOffers />}
    </ProfileLayout>
  )
}

export async function getServerSideProps({ req }) {
  const auth = await getSession({ req })

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
          domains: { select: { id: true } },
          hiddenFromInstitutions: { select: { id: true } },
          professions: { select: { id: true } },
        },
      },
    },
    where: { id: auth.user.id },
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
