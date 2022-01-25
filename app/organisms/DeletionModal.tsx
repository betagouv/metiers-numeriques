import { Button, Modal } from '@singularity/core'

type DeletionModalProps = {
  entity: string
  onCancel: Common.FunctionLike
  onConfirm: Common.FunctionLike
}
export const DeletionModal = ({ entity, onCancel, onConfirm }: DeletionModalProps) => (
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
