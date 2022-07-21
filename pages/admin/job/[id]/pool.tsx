import { ADMIN_ERROR, AdminErrorCard } from '@app/atoms/AdminErrorCard'
import { AdminTitle } from '@app/atoms/AdminTitle'
import { DocumentViewer } from '@app/atoms/DocumentViewer'
import { Spacer } from '@app/atoms/Spacer'
import { Spinner } from '@app/molecules/AdminLoader/Spinner'
import {
  PageContainer,
  ApplicationActions,
  ApplicationContainer,
  ApplicationLetter,
  ApplicationSubtitle,
  ApplicationHeader,
  CandidatesList,
  CandidateInfos,
  CandidateTouchPoints,
  FullHeightCard,
  LoadingContainer,
} from '@app/organisms/CandidatePool/components'
import { Col, Row } from '@app/organisms/CandidatePool/Grid'
import { useCandidatePoolQueries } from '@app/organisms/CandidatePool/hooks'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

// So we can have a nice layout with scrolling cards:
// - 36px: Title height
// - 16px: Space between title & body
// - 32px: Page padding
const BODY_HEIGHT = 'calc(100% - 36px - 16px - 32px)'

export default function JobApplicationPool() {
  const router = useRouter()
  const { id } = router.query

  const [jobTitle, setJobTitle] = useState<string>('')

  const {
    applications,
    currentApplication,
    fetchApplications,
    handleAccepted,
    handleRejected,
    isError,
    isLoading,
    setCurrentApplication,
  } = useCandidatePoolQueries(id as string)

  useEffect(() => {
    // Fetch job
    fetch(`/api/jobs/${id}`)
      .then(res => res.json())
      .then(job => setJobTitle(job.title))

    fetchApplications()
  }, [])

  const currentCandidate = currentApplication?.candidate

  return (
    <PageContainer>
      <AdminTitle>Candidature: {jobTitle}</AdminTitle>
      <Spacer units={1} />
      <Row style={{ height: BODY_HEIGHT }}>
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
            {isError && (
              <LoadingContainer>
                <AdminErrorCard error={ADMIN_ERROR.NEXT_REQUEST} />
              </LoadingContainer>
            )}
            {isLoading && (
              <LoadingContainer>
                <Spinner />
              </LoadingContainer>
            )}
            {!isLoading && !isError && currentCandidate && (
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
            )}
          </FullHeightCard>
        </Col>
      </Row>
    </PageContainer>
  )
}
