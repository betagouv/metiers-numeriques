import { AdminTitle } from '@app/atoms/AdminTitle'
import { Link } from '@app/atoms/Link'
import { theme } from '@app/theme'
import { JOB_CONTRACT_TYPE_LABEL } from '@common/constants'
import { handleError } from '@common/helpers/handleError'
import { Domain } from '@prisma/client'
import { Button as SUIButton, Card as SUICard } from '@singularity/core'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Check, GitHub, Link as LinkIcon, Mail, Phone, X } from 'react-feather'
import styled from 'styled-components'

import type { File, User, Candidate, JobApplication } from '@prisma/client'

const Button = styled(SUIButton)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Row = styled.div<{ centered?: boolean; fullHeight?: boolean; gap?: number }>`
  display: flex;
  flex-direction: row;
  gap: ${p => p.gap || 2}rem;
  ${p => (p.fullHeight ? 'height: 100%;' : '')}
  ${p => (p.centered ? 'justify-content: center;' : '')}
`

const Col = styled.div<{ size: number }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-basis: ${p => p.size}%;
`

const Card = styled(SUICard)`
  padding: 0;
  height: 100%;
`

const CandidateList = styled(Card)`
  > *:not(:last-child) {
    border-bottom: 1px solid grey;
  }
`

const CandidateMenu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  cursor: pointer;
`

const CandidateName = styled.div`
  font-size: 1.125rem;
  line-height: 1.25rem;
  font-weight: 500;
`

const CandidateInfo = styled.div`
  font-size: 0.85rem;
  line-height: 1.25rem;
  color: ${theme.color.neutral.grey};
`

const Dot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${theme.color.warning.lemon};
`

const ApplicationContainer = styled.div`
  padding: 1.5rem;
`

const ApplicationSubtitle = styled.div`
  font-size: 1.25rem;
  line-height: 1.5rem;
  color: ${theme.color.neutral.grey};
`

const Spacer = styled.div<{ units?: number }>`
  margin-bottom: ${p => p.units || 1}rem;
`

const Tag = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  height: 1.5rem;
  border-radius: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: ${p => p.color || theme.color.neutral.greyBlue};
`

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
`

type CandidateWithRelation = Candidate & { domains: Domain[]; user: User }

type JobApplicationWithRelation = JobApplication & {
  candidate: CandidateWithRelation
  cvFile: File
}

const getCandidateFullName = (candidate: CandidateWithRelation) =>
  `${candidate.user.firstName} ${candidate.user.lastName}`

export default function JobApplicationPool() {
  const router = useRouter()
  const { id } = router.query

  const [applications, setApplications] = useState<JobApplicationWithRelation[]>([])
  const [currentApplication, setCurrentApplication] = useState<JobApplicationWithRelation>()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/jobs/${id}/applications`)
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }
        setIsError(true)
      })
      .then(data => {
        setApplications(data)
        setCurrentApplication(data[0])
      })
      .catch(err => {
        handleError(err, 'pages/admin/domain/[id].tsx > fetchDomain()')
        setIsError(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <div>Loading</div>
  }
  if (isError) {
    return <div>Error</div>
  }

  const currentCandidate = currentApplication?.candidate

  return (
    <Row fullHeight>
      <Col size={20}>
        <CandidateList>
          {applications.map(application => (
            <CandidateMenu onClick={() => setCurrentApplication(application)}>
              <div>
                <CandidateName>{getCandidateFullName(application.candidate)}</CandidateName>
                <CandidateInfo>{application.candidate.currentJob}</CandidateInfo>
                <CandidateInfo>{application.candidate.yearsOfExperience} ans d&apos;expérience</CandidateInfo>
              </div>
              {application.candidate.id === currentCandidate?.id && <Dot />}
            </CandidateMenu>
          ))}
        </CandidateList>
      </Col>
      <Col size={80}>
        <Card>
          {currentCandidate ? (
            <Row fullHeight>
              <Col size={50}>
                <ApplicationContainer>
                  <AdminTitle>{getCandidateFullName(currentCandidate)}</AdminTitle>
                  <Spacer units={0.5} />
                  <ApplicationSubtitle>
                    {currentCandidate.currentJob} • {currentCandidate.yearsOfExperience} ans d&apos;expérience
                  </ApplicationSubtitle>
                  <Spacer units={1} />
                  <Row>
                    <Row gap={0.5}>
                      <Mail />
                      <Link href={`mailto:${currentCandidate.user.email}`} rel="noreferrer" target="_blank">
                        {currentCandidate.user.email}
                      </Link>
                    </Row>
                    <Row gap={0.5}>
                      <Phone />
                      <Link href={`tel:${currentCandidate.phone}`} rel="noreferrer" target="_blank">
                        {currentCandidate.phone}
                      </Link>
                    </Row>
                    {currentCandidate.githubUrl && (
                      <Row gap={0.5}>
                        <GitHub />
                        <Link href={currentCandidate.githubUrl} rel="noreferrer" target="_blank">
                          GitHub
                        </Link>
                      </Row>
                    )}
                    {currentCandidate.portfolioUrl && (
                      <Row gap={0.5}>
                        <LinkIcon />
                        <Link href={currentCandidate.portfolioUrl} rel="noreferrer" target="_blank">
                          Portfolio
                        </Link>
                      </Row>
                    )}
                  </Row>
                  <Spacer units={3} />

                  <Row centered>
                    <Button accent="danger">
                      <X /> Refuser cette candidature
                    </Button>
                    <Button accent="success">
                      <Check /> Mettre dans mon vivier
                    </Button>
                  </Row>
                  <Spacer units={3} />

                  <ApplicationSubtitle>A propos de {currentCandidate.user.firstName}</ApplicationSubtitle>
                  <Row gap={0.5}>
                    <ul>
                      <li>
                        <ListItem>
                          Localisation:
                          <Tag color={theme.color.success.mint}>{currentCandidate.region}</Tag>
                        </ListItem>
                      </li>
                      <li>
                        <ListItem>
                          Types de contrat recherché:
                          {currentCandidate.contractTypes.map(contractType => (
                            <Tag color={theme.color.warning.lighYellow}>{JOB_CONTRACT_TYPE_LABEL[contractType]}</Tag>
                          ))}
                        </ListItem>
                      </li>
                      <li>
                        <ListItem>
                          Domaines d&apos;intérêt:
                          {currentCandidate.domains.map(domain => (
                            <Tag color={theme.color.primary.lightBlue}>{domain.name}</Tag>
                          ))}
                        </ListItem>
                      </li>
                    </ul>
                  </Row>

                  <Spacer units={2} />

                  <ApplicationSubtitle>Ses motivations</ApplicationSubtitle>
                  <Spacer units={1} />
                  <p>{currentApplication.applicationLetter}</p>
                </ApplicationContainer>
              </Col>
              <Col size={50}>
                <object data={currentApplication?.cvFile?.url} style={{ height: '100%' }} type="application/pdf">
                  <iframe src="https://docs.google.com/viewer?url=your_url_to_pdf&embedded=true" title="Candidate CV" />
                </object>
              </Col>
            </Row>
          ) : (
            <div>Choose a candidate to see the full application</div>
          )}
        </Card>
      </Col>
    </Row>
  )
}
