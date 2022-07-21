import { Tag } from '@app/atoms/Tag'
import { JOB_CONTRACT_TYPE_LABEL } from '@common/constants.shared'
import React from 'react'
import styled from 'styled-components'

import { CandidateWithRelation } from './types'

type CandidateInfosProps = {
  candidate: CandidateWithRelation
}

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.5rem 0;
`

export const CandidateInfos = ({ candidate }: CandidateInfosProps) => (
  <ul>
    <li>
      <ListItem>
        Compétences:
        {!candidate.professions.length && ' Non renseignées'}
        {candidate.professions.map(profession => (
          <Tag color="info">{profession.name}</Tag>
        ))}
      </ListItem>
    </li>
    <li>
      <ListItem>
        Localisation:
        <Tag color="success">{candidate.region}</Tag>
      </ListItem>
    </li>
    <li>
      <ListItem>
        Domaines d&apos;intérêt:
        {!candidate.domains.length && ' Non renseignés'}
        {candidate.domains.map(domain => (
          <Tag color="primary">{domain.name}</Tag>
        ))}
      </ListItem>
    </li>
    <li>
      <ListItem>
        Types de contrat recherché:
        {!candidate.contractTypes.length && ' Non renseignés'}
        {candidate.contractTypes.map(contractType => (
          <Tag color="warning">{JOB_CONTRACT_TYPE_LABEL[contractType]}</Tag>
        ))}
      </ListItem>
    </li>
  </ul>
)
