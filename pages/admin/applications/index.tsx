import { ADMIN_ERROR, AdminErrorCard } from '@app/atoms/AdminErrorCard'
import { AdminTitle } from '@app/atoms/AdminTitle'
import { DocumentViewer } from '@app/atoms/DocumentViewer'
import { Spacer } from '@app/atoms/Spacer'
import { Spinner } from '@app/molecules/AdminLoader/Spinner'
import {
  PageContainer,
  VivierActions,
  ApplicationContainer,
  ApplicationLetter,
  ApplicationSubtitle,
  ApplicationHeader,
  CandidatesList,
  CandidateInfos,
  CandidateFilters,
  CandidateTouchPoints,
  FullHeightCard,
  LoadingContainer,
} from '@app/organisms/CandidatePool/components'
import { Col, Row } from '@app/organisms/CandidatePool/Grid'
import { useCandidatePoolQueries } from '@app/organisms/CandidatePool/hooks'
import React, { useEffect, useState } from 'react'

import type { JobApplicationWithRelation } from '@app/organisms/CandidatePool/types'

// So we can have a nice layout with scrolling cards:
// - 36px: Title height
// - 64px: Page padding + spaces between title & filters
// - 65px: Filters height
const BODY_HEIGHT = 'calc(100% - 36px - 64px - 65px)'

export default function Applications() {
  const [currentApplication, setCurrentApplication] = useState<JobApplicationWithRelation>()

  const { applications, fetchApplications, isError, isLoading } = useCandidatePoolQueries()

  useEffect(() => {
    fetchApplications({}).then(applications => {
      setCurrentApplication(applications[0])
    })
  }, [])

  const currentCandidate = currentApplication?.candidate

  return (
    <PageContainer>
      <AdminTitle>Mon vivier</AdminTitle>
      <Spacer units={1} />
      <CandidateFilters onFilter={fetchApplications} />
      <Spacer units={1} />
      <Row style={{ height: BODY_HEIGHT }}>
        <Col size={20}>
          <CandidatesList
            applications={applications}
            currentApplicationId={currentApplication?.id}
            onClickApplication={setCurrentApplication}
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
                      <VivierActions application={currentApplication} />
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
