import { SelectOption } from '@app/atoms/Select'
import { handleError } from '@common/helpers/handleError'
import { Button as SUIButton, Modal, Select } from '@singularity/core'
import React, { useEffect, useState } from 'react'
import { LogIn } from 'react-feather'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'

import { JobApplicationWithRelation } from './types'

const Button = styled(SUIButton)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

type VivierActionsProps = {
  application: JobApplicationWithRelation
}

export const VivierActions = ({ application }: VivierActionsProps) => {
  const [showModal, setShowModal] = useState(false)
  const [jobs, setJobs] = useState<Common.App.SelectOption[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string>()

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(jobs => setJobs(jobs.map(job => ({ label: job.title, value: job.id }))))
  }, [])

  const handleDuplicateForJob = async () => {
    try {
      await fetch(`/api/applications/${application.id}/duplicate`, {
        body: JSON.stringify({ jobId: selectedJobId }),
        method: 'POST',
      })
      toast.success("La candidature est positionnée sur l'offre demandée")
      setShowModal(false)
    } catch (e) {
      handleError(e, 'app/organisms/CandidatePool/VivierActions.tsx > handleDuplicateForJob()')
      toast.error('Une erreur est survenue')
    }
  }

  return (
    <>
      <Button accent="success" onClick={() => setShowModal(true)}>
        <LogIn /> Proposer cette candidature pour une offre
      </Button>
      {application && showModal && (
        <Modal onCancel={() => setShowModal(false)}>
          <Modal.Body>
            <Modal.Title>Proposer cette candidature pour une offre</Modal.Title>

            <br />
            <Select
              label="Choisir l'offre d'emploi"
              // @ts-ignore
              onChange={(option: SelectOption | null) => setSelectedJobId(option?.value)}
              options={jobs}
            />
          </Modal.Body>

          <Modal.Action>
            <Button accent="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button accent="info" onClick={handleDuplicateForJob}>
              Confirmer
            </Button>
          </Modal.Action>
        </Modal>
      )}
    </>
  )
}
