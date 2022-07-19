import { AdminTitle } from '@app/atoms/AdminTitle'
import { DocumentViewer } from '@app/atoms/DocumentViewer'
import { Spacer } from '@app/atoms/Spacer'
import { ApplicationActions } from '@app/organisms/CandidatePool/ApplicationActions'
import { ApplicationHeader } from '@app/organisms/CandidatePool/ApplicationHeader'
import { ApplicationSubtitle } from '@app/organisms/CandidatePool/ApplicationSubtitle'
import { CandidateInfos } from '@app/organisms/CandidatePool/CandidateInfos'
import { CandidatesList } from '@app/organisms/CandidatePool/CandidatesList'
import { CandidateTouchPoints } from '@app/organisms/CandidatePool/CandidateTouchPoints'
import { FullHeightCard } from '@app/organisms/CandidatePool/FullHeightCard'
import { Col, Row } from '@app/organisms/CandidatePool/Grid'
import { useCandidatePoolQueries } from '@app/organisms/CandidatePool/hooks'
import { JobApplicationWithRelation } from '@app/organisms/CandidatePool/types'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const PageContainer = styled.div`
  height: 100vh;
  overflow: hidden;
`

const ApplicationContainer = styled.div`
  padding: 1.5rem;
`

const ApplicationLetter = styled.p`
  white-space: pre-wrap;
`

export default function JobApplicationPool() {
  const router = useRouter()
  const { id } = router.query

  const [jobTitle, setJobTitle] = useState<string>('')
  const [currentApplication, setCurrentApplication] = useState<JobApplicationWithRelation>()

  const { applications, fetchApplications, handleAccepted, handleRejected, isError, isLoading } =
    useCandidatePoolQueries(id as string)

  useEffect(() => {
    // Fetch job
    fetch(`/api/jobs/${id}`)
      .then(res => res.json())
      .then(job => setJobTitle(job.title))

    fetchApplications().then(applications => setCurrentApplication(applications[0]))
  }, [])

  if (isLoading && !applications.length) {
    return <div>Loading</div>
  }
  if (isError) {
    return <div>Error</div>
  }

  const currentCandidate = currentApplication?.candidate

  return (
    <PageContainer>
      <AdminTitle>Candidature: {jobTitle}</AdminTitle>
      <Spacer units={1} />
      {/* TODO: fix the weird height */}
      <Row style={{ height: '92%' }}>
        <Col size={20}>
          <CandidatesList
            applications={applications}
            currentApplicationId={currentApplication?.id}
            onClickApplication={setCurrentApplication}
            showFilters
          />
        </Col>
        <Col size={80}>
          <FullHeightCard>
            {currentCandidate ? (
              <Row style={{ height: '100%' }}>
                <Col scroll size={50}>
                  <ApplicationContainer>
                    <ApplicationHeader application={currentApplication} />
                    <Spacer units={1} />
                    <CandidateTouchPoints candidate={currentCandidate} />
                    <Spacer units={3} />

                    <Row centered>
                      <ApplicationActions
                        application={currentApplication}
                        onAccepted={handleAccepted}
                        onRejected={handleRejected}
                      />
                    </Row>
                    <Spacer units={3} />

                    <ApplicationSubtitle>A propos de {currentCandidate.user.firstName}</ApplicationSubtitle>
                    <Row gap={0.5}>
                      <CandidateInfos candidate={currentCandidate} />
                    </Row>

                    <Spacer units={2} />

                    <ApplicationSubtitle>Ses motivations</ApplicationSubtitle>
                    <Spacer units={1} />
                    <ApplicationLetter>{currentApplication.applicationLetter}</ApplicationLetter>
                  </ApplicationContainer>
                </Col>
                <Col size={50}>
                  {currentApplication?.cvFile && <DocumentViewer url={currentApplication.cvFile.url} />}
                </Col>
              </Row>
            ) : (
              <div>Choose a candidate to see the full application</div>
            )}
          </FullHeightCard>
        </Col>
      </Row>
    </PageContainer>
  )
}
