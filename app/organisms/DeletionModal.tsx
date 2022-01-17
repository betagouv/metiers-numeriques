import { Button, Modal } from '@singularity/core'
import BetterPropTypes from 'better-prop-types'

export default function DeletionModal({ entity, onCancel, onConfirm }) {
  return (
    <Modal onCancel={onCancel}>
      <Modal.Body>
        <Modal.Title>Confirmation de suppression</Modal.Title>

        <p>
          Êtes-vous sûr·e de vouloir supprimer <strong>{entity}</strong> ?
        </p>
      </Modal.Body>

      <Modal.Action>
        <Button accent="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button accent="danger" onClick={onConfirm}>
          Supprimer
        </Button>
      </Modal.Action>
    </Modal>
  )
}

DeletionModal.propTypes = {
  entity: BetterPropTypes.string.isRequired,
  onCancel: BetterPropTypes.func.isRequired,
  onConfirm: BetterPropTypes.func.isRequired,
}
