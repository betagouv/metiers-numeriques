import { Link } from '@app/atoms/Link'
import { CandidateWithRelation } from '@app/libs/candidate'
import { Row } from '@app/organisms/CandidatePool/Grid'
import React from 'react'
import { GitHub, Link as LinkIcon, Linkedin, Mail, Phone } from 'react-feather'

type CandidateTouchPointsProps = {
  candidate: CandidateWithRelation
}

export const CandidateTouchPoints = ({ candidate }: CandidateTouchPointsProps) => (
  <Row style={{ flexWrap: 'wrap' }}>
    <Row gap={0.5}>
      <Mail />
      <Link href={`mailto:${candidate.user.email}`} rel="noreferrer" target="_blank">
        {candidate.user.email}
      </Link>
    </Row>
    <Row gap={0.5}>
      <Phone />
      <Link href={`tel:${candidate.phone}`} rel="noreferrer" target="_blank">
        {candidate.phone}
      </Link>
    </Row>
    {candidate.linkedInUrl && (
      <Row gap={0.5}>
        <Linkedin />
        <Link href={candidate.linkedInUrl} rel="noreferrer" target="_blank">
          LinkedIn
        </Link>
      </Row>
    )}
    {candidate.githubUrl && (
      <Row gap={0.5}>
        <GitHub />
        <Link href={candidate.githubUrl} rel="noreferrer" target="_blank">
          GitHub
        </Link>
      </Row>
    )}
    {candidate.portfolioUrl && (
      <Row gap={0.5}>
        <LinkIcon />
        <Link href={candidate.portfolioUrl} rel="noreferrer" target="_blank">
          Portfolio
        </Link>
      </Row>
    )}
  </Row>
)
