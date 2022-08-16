import { prisma } from '@api/libs/prisma'
import { Spacer } from '@app/atoms/Spacer'
import { Title } from '@app/atoms/Title'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { Form } from '@app/molecules/Form'
import { ActionBar } from '@app/organisms/Profile/ActionBar'
import { theme } from '@app/theme'
import { File, Job } from '@prisma/client'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import React, { useState } from 'react'
import styled from 'styled-components'
import * as Yup from 'yup'

const Container = styled.div`
  max-width: 800px;
`

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
`

const Error = styled.div`
  padding: 1.5rem;
  color: ${theme.color.danger.scarlet};
  font-weight: 500;
  border: 1px solid ${theme.color.danger.scarlet};
  border-radius: 0.5rem;
`

type JobApplicationFormData = {
  application?: {
    applicationLetter: string
    cvFile: File
    id: string
  }
  candidate: {
    githubUrl?: string
    id: string
    portfolioUrl?: string
  }
}

const FormSchema = Yup.object().shape({
  application: Yup.object().shape({
    applicationLetter: Yup.string().required("Merci d'indiquer tes motivations à nous rejoindre"),
    cvFile: Yup.object().required('Merci de joindre ton CV pour postuler'),
  }),
})

type JobApplicationPageProps = {
  initialValues: JobApplicationFormData
  job?: Job
}

export default function JobApplicationPage({ initialValues, job }: JobApplicationPageProps) {
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleSubmit = async values => {
    const response = await fetch('/api/applications', { body: JSON.stringify(values), method: 'POST' })

    if (response.status === 200) {
      router.push('/')
    } else {
      setError(true)
    }
  }

  return (
    <div className="fr-container">
      <Container>
        <Title as="h1">Ta candidature</Title>
        <Spacer units={1} />
        {job && <Link href={`/emploi/${job.id}`}>{job.title}</Link>}
        <Spacer units={1} />
        {error && <Error>Une erreur est survenue, merci de réessayer plus tard.</Error>}
        <Spacer units={2} />
        <Form initialValues={initialValues} onSubmit={handleSubmit} validationSchema={FormSchema}>
          <SectionTitle>Tes motivations</SectionTitle>
          <Form.TextInput
            aria-label="Tes motiviations"
            // @ts-ignore FIXME: styled-components "as" prop is not taken into account here
            as="textarea"
            name="application.applicationLetter"
            placeholder="Explique-nous tes motivations à nous rejoindre !"
            rows="5"
          />
          <Spacer units={4} />
          <SectionTitle>Tes compétences</SectionTitle>
          <Form.FileUpload label="Mon CV" name="application.cvFile" />
          <Spacer units={4} />
          <SectionTitle>Autres éléments que tu souhaites partager</SectionTitle>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-6">
              <Form.TextInput
                iconClassName="ri-github-fill"
                label="Ton profil GitHub"
                name="candidate.githubUrl"
                placeholder="GitHub URL"
              />
            </div>
            <div className="fr-col-6">
              <Form.TextInput
                iconClassName="ri-link-m"
                label="Ton portfoilio"
                name="portfolioUrl"
                placeholder="Portfoilio URL"
              />
            </div>
          </div>
          <ActionBar className="fr-pt-md-16v">
            <Form.Submit>Envoyer ma candidature</Form.Submit>
          </ActionBar>
        </Form>
      </Container>
      <Spacer units={4} />
    </div>
  )
}

export async function getServerSideProps({ params, req }) {
  const session = await getSession({ req })

  if (!session?.user) {
    return {
      redirect: {
        destination: '/connexion',
        permanent: false,
      },
    }
  }

  const candidate = await prisma.candidate.findUnique({ where: { userId: session.user.id } })

  // Redirects to profile page if not filled
  if (!candidate) {
    return {
      redirect: {
        destination: '/profil',
        permanent: false,
      },
    }
  }

  const job = params?.jobId
    ? await prisma.job.findUnique({ select: { id: true, title: true }, where: { id: params?.jobId } })
    : null

  const jobApplication = await prisma.jobApplication.findFirst({
    include: { cvFile: true, job: { select: { title: true } } },
    where: { candidateId: candidate.id, jobId: params?.jobId || null },
  })
  const applicationValues = jobApplication
    ? R.pick(['id', 'applicationLetter', 'cvFile', 'cvFileId'], jobApplication)
    : {}

  return {
    props: {
      initialValues: {
        application: stringifyDeepDates(applicationValues),
        candidate: {
          githubUrl: candidate.githubUrl,
          id: candidate.id,
          portfolioUrl: candidate.portfolioUrl,
        },
      },
      job,
    },
  }
}