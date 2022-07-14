import { RejectionModal } from '@app/organisms/CandidatePool/RejectionModal'
import { JobApplicationStatus } from '@prisma/client'
import { Button as SUIButton } from '@singularity/core'
import React, { useState } from 'react'
import { Check, Star, X } from 'react-feather'
import styled from 'styled-components'

import { JobApplicationWithRelation } from './types'

const Button = styled(SUIButton)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

type ActionButtonsProps = {
  application: JobApplicationWithRelation
  onAccepted: (applicationId: string, isAlreadyAccepted: boolean) => void
  onRejected: (applicationId: string, rejectionReason: string) => void
}

export const ActionButtons = ({ application, onAccepted, onRejected }: ActionButtonsProps) => {
  const [showModal, setShowModal] = useState(false)

  const isAccepted = application.status === JobApplicationStatus.ACCEPTED
  const isRejected = application.status === JobApplicationStatus.REJECTED

  return (
    <>
      <Button accent="danger" disabled={isRejected} onClick={() => setShowModal(true)}>
        <X /> {isRejected ? 'Candidature refusée' : 'Refuser cette candidature'}
      </Button>
      <Button accent={isAccepted ? 'warning' : 'success'} onClick={() => onAccepted(application.id, isAccepted)}>
        <Star /> {isAccepted ? 'Retirer des favoris' : 'Mettre en favori'}
      </Button>
      {application && showModal && (
        <RejectionModal onCancel={() => setShowModal(false)} onConfirm={reason => onRejected(application.id, reason)} />
      )}
    </>
  )
}
