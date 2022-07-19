import { AdminTitle } from '@app/atoms/AdminTitle'
import { DocumentViewer } from '@app/atoms/DocumentViewer'
import { Spacer } from '@app/atoms/Spacer'
import { AdminForm } from '@app/molecules/AdminForm'
import { DomainSelect } from '@app/molecules/AdminForm/DomainSelect'
import { ProfessionSelect } from '@app/molecules/AdminForm/ProfessionSelect'
import { Select } from '@app/molecules/AdminForm/Select'
import { TextInput } from '@app/molecules/AdminForm/TextInput'
import { CandidateInfos } from '@app/organisms/CandidatePool/CandidateInfos'
import { CandidatesList } from '@app/organisms/CandidatePool/CandidatesList'
import { CandidateTouchPoints } from '@app/organisms/CandidatePool/CandidateTouchPoints'
import { FullHeightCard } from '@app/organisms/CandidatePool/FullHeightCard'
import { Col, Row } from '@app/organisms/CandidatePool/Grid'
import { useCandidatePoolQueries } from '@app/organisms/CandidatePool/hooks'
import { formatSeniority, getCandidateFullName } from '@app/organisms/CandidatePool/utils'
import { VivierActions } from '@app/organisms/CandidatePool/VivierActions'
import { theme } from '@app/theme'
import { JOB_CONTRACT_TYPES_AS_OPTIONS, REGIONS_AS_OPTIONS, SENIORITY_AS_OPTIONS } from '@common/constants'
import { JobContractType } from '@prisma/client'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import React, { useEffect, useRef, useState } from 'react'
import { Download } from 'react-feather'
import styled from 'styled-components'

import type { FilterProps, JobApplicationWithRelation } from '@app/organisms/CandidatePool/types'

const PageContainer = styled.div`
  height: 100vh;
  overflow: hidden;
`

const ApplicationContainer = styled.div`
  padding: 1.5rem;
`

const ApplicationSubtitle = styled.div`
  font-size: 1.25rem;
  line-height: 1.5rem;
  color: ${theme.color.neutral.grey};
`

const ApplicationLetter = styled.p`
  white-space: pre-wrap;
`

const ApplicationHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Filters = ({ onFilter }) => {
  const filters = useRef<FilterProps>({})

  const handleChangeKeyword = (keyword?: string) => {
    filters.current.keyword = keyword
    onFilter(filters.current)
  }

  const handleChangeProfession = (professionId?: string) => {
    filters.current.professionId = professionId
    onFilter(filters.current)
  }

  const handleChangeDomains = (domainIds?: string[]) => {
    filters.current.domainIds = domainIds
    onFilter(filters.current)
  }

  const handleChangeContractTypes = (contractTypes?: JobContractType[]) => {
    filters.current.contractTypes = contractTypes
    onFilter(filters.current)
  }

  const handleChangeRegion = (region?: string) => {
    filters.current.region = region
    onFilter(filters.current)
  }

  const handleChangeSeniority = (seniority?: number) => {
    filters.current.seniority = seniority
    onFilter(filters.current)
  }

  return (
    <AdminForm initialValues={{}} onSubmit={onFilter}>
      <Row gap={0.5} style={{ alignItems: 'flex-end' }}>
        <Col size={25}>
          <TextInput
            label="Recherche par mot-clé"
            name="keyword"
            onChange={e => handleChangeKeyword(e.target.value)}
            placeholder="Développeur, chef de projet, ..."
          />
        </Col>
        <Col size={15}>
          <ProfessionSelect label="Compétence" name="professionId" onChange={handleChangeProfession} />
        </Col>

        <Col size={15}>
          <DomainSelect label="Domaines" name="domainIds" onChange={handleChangeDomains} />
        </Col>
        <Col size={15}>
          <Select
            isMulti
            label="Types de contrat"
            name="contractTypes"
            onChange={handleChangeContractTypes}
            options={JOB_CONTRACT_TYPES_AS_OPTIONS}
          />
        </Col>
        <Col size={15}>
          <Select label="Localisation" name="region" onChange={handleChangeRegion} options={REGIONS_AS_OPTIONS} />
        </Col>
        <Col size={15}>
          <Select label="Seniorité" name="seniority" onChange={handleChangeSeniority} options={SENIORITY_AS_OPTIONS} />
        </Col>
      </Row>
    </AdminForm>
  )
}

export const generateZipFromCloud = (application: JobApplicationWithRelation) => {
  const filename = `Candidature ${getCandidateFullName(application.candidate)}`

  const zip = new JSZip()
  const folder = zip.folder(filename)

  const { url } = application.cvFile
  const blobPromise = fetch(url).then(response => {
    if (response.status === 200 || response.status === 0) {
      return Promise.resolve(response.blob())
    }

    return Promise.reject(new Error(response.statusText))
  })

  const cvFileName = url.substring(url.lastIndexOf('/'))
  folder.file(cvFileName, blobPromise)

  folder.file(
    'candidature.txt',
    [
      `Nom: ${getCandidateFullName(application.candidate)}`,
      `Email: ${application.candidate.user.email}`,
      `Tel: ${application.candidate.phone}`,
      `Localisation: ${application.candidate.region}`,
      `Compétences: ${application.candidate.professions.map(p => p.name).join(', ')}`,
      `Domaines d'intérêt: ${application.candidate.domains.map(d => d.name).join(', ')}`,
      '',
      application.applicationLetter,
    ].join('\n'),
  )

  zip
    .generateAsync({ type: 'blob' })
    .then(blob => saveAs(blob, filename))
    .catch(e => console.log(e)) // TODO: handle error
}

export default function Applications() {
  const [currentApplication, setCurrentApplication] = useState<JobApplicationWithRelation>()

  const { applications, fetchApplications, handleAccepted, handleRejected, isError, isLoading } =
    useCandidatePoolQueries()

  useEffect(() => {
    fetchApplications({}).then(applications => {
      setCurrentApplication(applications[0])
    })
  }, [])

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
      <Filters onFilter={fetchApplications} />
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
                    <ApplicationHeaderContainer>
                      <div>
                        <AdminTitle>{getCandidateFullName(currentCandidate)}</AdminTitle>
                        <Spacer units={0.5} />
                        <ApplicationSubtitle>
                          {currentCandidate.currentJob} • {formatSeniority(currentCandidate.seniorityInYears)}
                        </ApplicationSubtitle>
                      </div>
                      <Download
                        onClick={() => generateZipFromCloud(currentApplication)}
                        size={32}
                        style={{ cursor: 'pointer' }}
                      />
                    </ApplicationHeaderContainer>
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
