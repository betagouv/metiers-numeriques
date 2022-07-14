import { Spacer } from '@app/atoms/Spacer'
import { Tag } from '@app/atoms/Tag'
import { formatSeniority, getCandidateFullName } from '@app/organisms/CandidatePool/utils'
import { theme } from '@app/theme'
import { JobApplicationStatus } from '@prisma/client'
import * as R from 'ramda'
import React, { useState } from 'react'
import styled from 'styled-components'

import { FullHeightCard } from './FullHeightCard'
import { Row } from './Grid'
import { JobApplicationWithRelation } from './types'

const CandidatesListContainer = styled(FullHeightCard)`
  height: 100%;
  overflow-y: scroll;

  > *:not(:last-child) {
    border-bottom: 1px solid grey;
  }
`

const CandidateMenu = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  cursor: pointer;
  border-width: 0 0.25rem;
  border-style: solid;
  border-color: ${p => (p.isSelected ? theme.color.primary.navy : 'white')};
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Dot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${theme.color.warning.lemon};
`

type CandidatesListProps = {
  applications: JobApplicationWithRelation[]
  currentApplicationId?: string
  onClickApplication: (application: JobApplicationWithRelation) => void
}

export const CandidatesList = ({ applications, currentApplicationId, onClickApplication }: CandidatesListProps) => {
  const [statusFilter, setStatusFilter] = useState<JobApplicationStatus>()

  const applicationStatusCounts = R.countBy(application => application.status, applications)

  return (
    <CandidatesListContainer>
      <Row gap={1} style={{ padding: '1.5rem' }}>
        <span>Filtres:</span>
        <Tag
          color="success"
          isSelected={statusFilter === JobApplicationStatus.ACCEPTED}
          onClick={() =>
            setStatusFilter(currentFilter =>
              currentFilter === JobApplicationStatus.ACCEPTED ? undefined : JobApplicationStatus.ACCEPTED,
            )
          }
        >
          Vivier ({applicationStatusCounts[JobApplicationStatus.ACCEPTED] || 0})
        </Tag>
        <Tag
          color="danger"
          isSelected={statusFilter === JobApplicationStatus.REJECTED}
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
          <CandidateMenu
            isSelected={currentApplicationId === application.id}
            onClick={() => onClickApplication(application)}
          >
            <CandidateMenuInfos>
              <CandidateName>{getCandidateFullName(application.candidate)}</CandidateName>
              <CandidateInfo>{application.candidate.currentJob}</CandidateInfo>
              <CandidateInfo>{formatSeniority(application.candidate.seniorityInYears)}</CandidateInfo>
              <Spacer units={0.5} />
              {application.status === JobApplicationStatus.ACCEPTED && <Tag color="success">Dans mon vivier</Tag>}
              {application.status === JobApplicationStatus.REJECTED && <Tag color="danger">Refusé</Tag>}
            </CandidateMenuInfos>
            {/* {application.candidate.id === currentCandidate?.id && <Dot />} */}
          </CandidateMenu>
        ))}
    </CandidatesListContainer>
  )
}
