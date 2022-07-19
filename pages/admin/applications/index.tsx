import { AdminTitle } from '@app/atoms/AdminTitle'
import { DocumentViewer } from '@app/atoms/DocumentViewer'
import { Spacer } from '@app/atoms/Spacer'
import { ApplicationHeader } from '@app/organisms/CandidatePool/ApplicationHeader'
import { ApplicationSubtitle } from '@app/organisms/CandidatePool/ApplicationSubtitle'
import { CandidateFilters } from '@app/organisms/CandidatePool/CandidateFilters'
import { CandidateInfos } from '@app/organisms/CandidatePool/CandidateInfos'
import { CandidatesList } from '@app/organisms/CandidatePool/CandidatesList'
import { CandidateTouchPoints } from '@app/organisms/CandidatePool/CandidateTouchPoints'
import { FullHeightCard } from '@app/organisms/CandidatePool/FullHeightCard'
import { Col, Row } from '@app/organisms/CandidatePool/Grid'
import { useCandidatePoolQueries } from '@app/organisms/CandidatePool/hooks'
import { VivierActions } from '@app/organisms/CandidatePool/VivierActions'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import type { JobApplicationWithRelation } from '@app/organisms/CandidatePool/types'

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

export default function Applications() {
  const [currentApplication, setCurrentApplication] = useState<JobApplicationWithRelation>()

  const { applications, fetchApplications, isError } = useCandidatePoolQueries()

  useEffect(() => {
    fetchApplications({}).then(applications => {
      setCurrentApplication(applications[0])
    })
  }, [])

  // TODO: handle loading
  // if (isLoading && !applications.length) {
  //   return <div>Loading</div>
  // }
  if (isError) {
    return <div>Error</div>
  }

  const currentCandidate = currentApplication?.candidate

  return (
    <PageContainer>
      <AdminTitle>Mon vivier</AdminTitle>
      <Spacer units={1} />
      <CandidateFilters onFilter={fetchApplications} />
      <Spacer units={1} />
      {/* TODO: fix the weird height */}
      <Row style={{ height: '82%' }}>
        <Col size={20}>
          <CandidatesList
            applications={applications}
            currentApplicationId={currentApplication?.id}
            onClickApplication={setCurrentApplication}
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
            ) : (
              <div>Choose a candidate to see the full application</div>
            )}
          </FullHeightCard>
        </Col>
      </Row>
    </PageContainer>
  )
}
