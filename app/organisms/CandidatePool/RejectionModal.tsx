import { Modal, Select, Button } from '@singularity/core'
import React, { useState } from 'react'

import type { SelectOption } from '@app/atoms/Select'

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

export const RejectionModal = ({ onCancel, onConfirm }) => {
  const [reason, setReason] = useState<string>()

  return (
    <Modal onCancel={onCancel}>
      <Modal.Body>
        <Modal.Title>Refuser cette candidature ?</Modal.Title>

        <p>Un email sera envoyé au candidat lui expliquant la raison de votre vhoix</p>
        <br />
        <Select
          label="Raison du refus"
          // @ts-ignore
          onChange={(option: SelectOption | null) => setReason(option?.value)}
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
