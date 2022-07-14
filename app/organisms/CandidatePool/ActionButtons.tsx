import { RejectionModal } from '@app/organisms/CandidatePool/RejectionModal'
import { JobApplicationStatus } from '@prisma/client'
import { Button as SUIButton } from '@singularity/core'
import React, { useState } from 'react'
import { Check, X } from 'react-feather'
import styled from 'styled-components'

import { JobApplicationWithRelation } from './types'

const Button = styled(SUIButton)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

type ActionButtonsProps = {
  application: JobApplicationWithRelation
  onAccepted: (applicationId: string) => void
  onRejected: (applicationId: string, rejectionReason: string) => void
}

export const ActionButtons = ({ application, onAccepted, onRejected }: ActionButtonsProps) => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button
        accent="danger"
        disabled={application.status === JobApplicationStatus.REJECTED}
        onClick={() => setShowModal(true)}
      >
        <X />{' '}
        {application.status === JobApplicationStatus.REJECTED ? 'Candidature refusée' : 'Refuser cette candidature'}
      </Button>
      <Button
        accent="success"
        disabled={application.status === JobApplicationStatus.ACCEPTED}
        onClick={() => onAccepted(application.id)}
      >
        <Check />{' '}
        {application.status === JobApplicationStatus.ACCEPTED ? 'Présent dans le vivier' : 'Mettre dans mon vivier'}
      </Button>
      {application && showModal && (
        <RejectionModal onCancel={() => setShowModal(false)} onConfirm={reason => onRejected(application.id, reason)} />
      )}
    </>
  )
}
