import { AdminTitle } from '@app/atoms/AdminTitle'
import { Link } from '@app/atoms/Link'
import { theme } from '@app/theme'
import { JOB_CONTRACT_TYPE_LABEL } from '@common/constants'
import { handleError } from '@common/helpers/handleError'
import { Domain, JobApplicationStatus } from '@prisma/client'
import { Select, Button as SUIButton, Card as SUICard, Modal } from '@singularity/core'
import { useRouter } from 'next/router'
import * as R from 'ramda'
import React, { useEffect, useState } from 'react'
import { Check, GitHub, Link as LinkIcon, Linkedin, Mail, Phone, X } from 'react-feather'
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
  gap: 1rem ${p => p.gap || 2}rem;
  ${p => (p.fullHeight ? 'height: 100%;' : '')}
  ${p => (p.centered ? 'justify-content: center;' : '')}
`

const Col = styled.div<{ scroll?: boolean; size: number }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-basis: ${p => p.size}%;
  ${p => (p.scroll ? 'overflow-y: scroll;' : '')}
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

const CandidateMenuInfos = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: calc(100% - 1rem);
  flex: 1;
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

const Tag = styled.div<{ color: string; onClick?: () => void }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  height: 1.5rem;
  border-radius: 0.75rem;
  padding: 0.25rem 0.5rem;
  color: white;
  background-color: ${p => p.color || theme.color.neutral.greyBlue};
  ${p => (p.onClick ? 'cursor: pointer;' : '')}
`

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
`

const ApplicationLetter = styled.p`
  white-space: pre-wrap;
`

type CandidateWithRelation = Candidate & { domains: Domain[]; user: User }

type JobApplicationWithRelation = JobApplication & {
  candidate: CandidateWithRelation
  cvFile: File
}

const REJECTION_REASONS = [
  'Manque d’expérience globale sur le poste',
  'Manque de compétences précises sur le poste (précisez aux candidats)',
  'Manque de lien global entre la candidature et le poste',
  'Le poste est déjà pourvu',
  'Le process est avancé avec d’autres candidats',
  'Le type de contrat recherché ne convient pas',
  'La localisation recherchée ne convient pas',
  'Le domaine recherché ne convient pas',
  'Le métier recherché ne convient pas',
  'La candidature n’est pas assez fournie pour pouvoir l’étudier',
  'Ce contrat nécessite des dispositions de sécurité nécessaires non remplies (nationalité, homologation sécurité etc)',
]

const RejectionModal = ({ onCancel, onConfirm }) => {
  const [reason, setReason] = useState<string>()

  return (
    <Modal onCancel={onCancel}>
      <Modal.Body>
        <Modal.Title>Souhaitez-vous vraiment refuser cette candidature ?</Modal.Title>

        <p>Un email sera envoyé au candidat lui expliquant la raison de votre vhoix</p>
        <br />
        <Select
          label="Raison du refus"
          onChange={option => setReason(option.value)}
          options={REJECTION_REASONS.map(reason => ({ label: reason, value: reason }))}
        />
      </Modal.Body>

      <Modal.Action>
        <Button accent="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button accent="danger" disabled={!reason} onClick={() => onConfirm(reason)}>
          Confirmer
        </Button>
      </Modal.Action>
    </Modal>
  )
}

const getCandidateFullName = (candidate: CandidateWithRelation) =>
  `${candidate.user.firstName} ${candidate.user.lastName}`

const formatSeniority = (seniority: number) => {
  if (seniority > 1) {
    return `${seniority} ans d'expérience`
  }
  if (seniority === 1) {
    return `${seniority} an d'expérience`
  }

  return 'Profil Junior'
}

export default function JobApplicationPool() {
  const router = useRouter()
  const { id } = router.query

  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<JobApplicationStatus>()
  const [jobTitle, setJobTitle] = useState<string>('')
  const [applications, setApplications] = useState<JobApplicationWithRelation[]>([])
  const [currentApplication, setCurrentApplication] = useState<JobApplicationWithRelation>()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/jobs/${id}/applications`)
      if (response.status !== 200) {
        setIsError(true)
      }
      const job = await response.json()
      setJobTitle(job.title)
      setApplications(job.applications)

      return job.applications
    } catch (err) {
      handleError(err, 'pages/admin/domain/[id].tsx > fetchDomain()')
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications().then(applications => setCurrentApplication(applications[0]))
  }, [])

  const handleAccepted = async (applicationId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/applications/${applicationId}/accept`, { method: 'PUT' })
      if (response.status === 200) {
        // TODO: add flash message
        await fetchApplications()
      } else {
        setIsError(true)
      }
    } catch (err) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejected = async (applicationId: string, rejectionReason: string) => {
    const body = JSON.stringify({ rejectionReason })
    try {
      setIsLoading(true)
      const response = await fetch(`/api/applications/${applicationId}/reject`, { body, method: 'PUT' })
      if (response.status === 200) {
        // TODO: add flash message
        await fetchApplications()
      } else {
        setIsError(true)
      }
    } catch (err) {
      setIsError(true)
    } finally {
      setIsLoading(false)
      setShowModal(false)
    }
  }

  if (isLoading) {
    return <div>Loading</div>
  }
  if (isError) {
    return <div>Error</div>
  }

  const currentCandidate = currentApplication?.candidate
  const applicationStatusCounts = R.countBy(application => application.status, applications)

  return (
    <>
      <AdminTitle>Candidature: {jobTitle}</AdminTitle>
      <Spacer units={1} />
      <Row fullHeight>
        <Col scroll size={20}>
          <CandidateList>
            <Row gap={1} style={{ padding: '1.5rem' }}>
              <span>Filtres:</span>
              <Tag
                color={
                  statusFilter === JobApplicationStatus.ACCEPTED ? theme.color.success.herbal : theme.color.success.mint
                }
                onClick={() =>
                  setStatusFilter(currentFilter =>
                    currentFilter === JobApplicationStatus.ACCEPTED ? undefined : JobApplicationStatus.ACCEPTED,
                  )
                }
              >
                Vivier ({applicationStatusCounts[JobApplicationStatus.ACCEPTED] || 0})
              </Tag>
              <Tag
                color={
                  statusFilter === JobApplicationStatus.REJECTED
                    ? theme.color.danger.raspberry
                    : theme.color.danger.rubicund
                }
                onClick={() =>
                  setStatusFilter(currentFilter =>
                    currentFilter === JobApplicationStatus.REJECTED ? undefined : JobApplicationStatus.REJECTED,
                  )
                }
              >
                Refusés ({applicationStatusCounts[JobApplicationStatus.REJECTED] || 0})
              </Tag>
            </Row>
            {applications
              .filter(application => (statusFilter ? application.status === statusFilter : true))
              .map(application => (
                <CandidateMenu onClick={() => setCurrentApplication(application)}>
                  <CandidateMenuInfos>
                    <CandidateName>{getCandidateFullName(application.candidate)}</CandidateName>
                    <CandidateInfo>{application.candidate.currentJob}</CandidateInfo>
                    <CandidateInfo>{formatSeniority(application.candidate.yearsOfExperience)}</CandidateInfo>
                    <Spacer units={0.5} />
                    {application.status === JobApplicationStatus.ACCEPTED && (
                      <Tag color={theme.color.success.mint}>Dans mon vivier</Tag>
                    )}
                    {application.status === JobApplicationStatus.REJECTED && (
                      <Tag color={theme.color.danger.rubicund}>Refusé</Tag>
                    )}
                  </CandidateMenuInfos>
                  {application.candidate.id === currentCandidate?.id && <Dot />}
                </CandidateMenu>
              ))}
          </CandidateList>
        </Col>
        <Col size={80}>
          <Card>
            {currentCandidate ? (
              <Row fullHeight>
                <Col scroll size={50}>
                  <ApplicationContainer>
                    <AdminTitle>{getCandidateFullName(currentCandidate)}</AdminTitle>
                    <Spacer units={0.5} />
                    <ApplicationSubtitle>
                      {currentCandidate.currentJob} • {formatSeniority(currentCandidate.yearsOfExperience)}
                    </ApplicationSubtitle>
                    <Spacer units={1} />
                    <Row style={{ flexWrap: 'wrap' }}>
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
                      {currentCandidate.linkedInUrl && (
                        <Row gap={0.5}>
                          <Linkedin />
                          <Link href={currentCandidate.linkedInUrl} rel="noreferrer" target="_blank">
                            LinkedIn
                          </Link>
                        </Row>
                      )}
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
                      <Button
                        accent="danger"
                        disabled={currentApplication.status === JobApplicationStatus.REJECTED}
                        onClick={() => setShowModal(true)}
                      >
                        <X />{' '}
                        {currentApplication.status === JobApplicationStatus.REJECTED
                          ? 'Candidature refusée'
                          : 'Refuser cette candidature'}
                      </Button>
                      <Button
                        accent="success"
                        disabled={currentApplication.status === JobApplicationStatus.ACCEPTED}
                        onClick={() => handleAccepted(currentApplication.id)}
                      >
                        <Check />{' '}
                        {currentApplication.status === JobApplicationStatus.ACCEPTED
                          ? 'Présent dans le vivier'
                          : 'Mettre dans mon vivier'}
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
                            {!currentCandidate.contractTypes.length && ' Non renseignés'}
                            {currentCandidate.contractTypes.map(contractType => (
                              <Tag color={theme.color.warning.lighYellow}>{JOB_CONTRACT_TYPE_LABEL[contractType]}</Tag>
                            ))}
                          </ListItem>
                        </li>
                        <li>
                          <ListItem>
                            Domaines d&apos;intérêt:
                            {!currentCandidate.domains.length && ' Non renseignés'}
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
                    <ApplicationLetter>{currentApplication.applicationLetter}</ApplicationLetter>
                  </ApplicationContainer>
                </Col>
                <Col size={50}>
                  <object data={currentApplication?.cvFile?.url} style={{ height: '100%' }} type="application/pdf">
                    <iframe
                      src="https://docs.google.com/viewer?url=your_url_to_pdf&embedded=true"
                      title="Candidate CV"
                    />
                  </object>
                </Col>
              </Row>
            ) : (
              <div>Choose a candidate to see the full application</div>
            )}
          </Card>
        </Col>
      </Row>
      {showModal && (
        <RejectionModal
          onCancel={() => setShowModal(false)}
          onConfirm={reason => handleRejected(currentApplication?.id, reason)}
        />
      )}
    </>
  )
}
