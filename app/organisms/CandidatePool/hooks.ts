import { handleError } from '@common/helpers/handleError'
import { useState } from 'react'

import { JobApplicationWithRelation } from './types'

export const useCandidatePoolQueries = (jobId?: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const [applications, setApplications] = useState<JobApplicationWithRelation[]>([])

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/applications${jobId ? `?jobId=${jobId}` : ''}`)
      if (response.status !== 200) {
        setIsError(true)
      }

      const data = await response.json()
      setApplications(data)

      return data
    } catch (err) {
      handleError(err, 'pages/admin/domain/[id].tsx > fetchDomain()')
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccepted = async (applicationId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/applications/${applicationId}/accept`, { method: 'PUT' })
      if (response.status === 200) {
        // TODO: add flash message
        await fetchApplications()
      } else {
        setIsError(true)
      }
    } catch (err) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejected = async (applicationId: string, rejectionReason: string) => {
    const body = JSON.stringify({ rejectionReason })
    try {
      setIsLoading(true)
      const response = await fetch(`/api/applications/${applicationId}/reject`, { body, method: 'PUT' })
      if (response.status === 200) {
        // TODO: add flash message
        await fetchApplications()
      } else {
        setIsError(true)
      }
    } catch (err) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return { applications, fetchApplications, handleAccepted, handleRejected, isError, isLoading }
}
