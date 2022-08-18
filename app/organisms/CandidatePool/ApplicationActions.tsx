import { Checkbox } from '@app/atoms/Checkbox'
import { Spacer } from '@app/atoms/Spacer'
import { JobApplicationWithRelation } from '@app/libs/candidate'
import { JobApplicationStatus } from '@prisma/client'
import { Button as SUIButton, Modal } from '@singularity/core'
import React, { useState } from 'react'
import { Star, X } from 'react-feather'
import styled from 'styled-components'

const Button = styled(SUIButton)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const REJECTION_REASONS = [
  'Manque d’expérience globale sur le poste',
  'Manque de compétences précises sur le poste',
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

type ApplicationActionsProps = {
  application: JobApplicationWithRelation
  onAccepted: (applicationId: string, isAlreadyAccepted: boolean) => void
  onRejected: (applicationId: string, rejectionReasons: string[]) => void
}

export const ApplicationActions = ({ application, onAccepted, onRejected }: ApplicationActionsProps) => {
  const [showModal, setShowModal] = useState(false)
  const [reasons, setReasons] = useState<string[]>([])

  const isAccepted = application.status === JobApplicationStatus.ACCEPTED
  const isRejected = application.status === JobApplicationStatus.REJECTED

  const handleCheckReason = (reason: string) => (checked: boolean) => {
    setReasons(currentReasons => {
      if (checked) {
        return [reason, ...currentReasons]
      }

      return currentReasons.filter(currentReason => currentReason !== reason)
    })
  }

  return (
    <>
      <Button accent="danger" disabled={isRejected} onClick={() => setShowModal(true)}>
        <X /> {isRejected ? 'Candidature refusée' : 'Refuser cette candidature'}
      </Button>
      <Button accent={isAccepted ? 'warning' : 'success'} onClick={() => onAccepted(application.id, isAccepted)}>
        <Star /> {isAccepted ? 'Retirer des favoris' : 'Mettre en favori'}
      </Button>
      {application && showModal && (
        <Modal onCancel={() => setShowModal(false)}>
          <Modal.Body>
            <Modal.Title>Refuser cette candidature ?</Modal.Title>

            <p>Un email sera envoyé au candidat lui expliquant la raison de votre choix</p>
            <br />
            {REJECTION_REASONS.map(reason => (
              <>
                <Checkbox label={reason} name={reason} onChange={handleCheckReason(reason)} />
                <Spacer units={0.5} />
              </>
            ))}
          </Modal.Body>

          <Modal.Action>
            <Button accent="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button accent="danger" disabled={!reasons} onClick={() => onRejected(application.id, reasons)}>
              Confirmer
            </Button>
          </Modal.Action>
        </Modal>
      )}
    </>
  )
}
