import { handleError } from '@common/helpers/handleError'
import * as R from 'ramda'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import type { FilterProps, JobApplicationWithRelation } from './types'

export const useCandidatePoolQueries = (jobId?: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const [applications, setApplications] = useState<JobApplicationWithRelation[]>([])

  const fetchApplications = async (filters: FilterProps = {}) => {
    const search = R.reject(R.isNil, { ...filters, jobId })
    const params = new URLSearchParams(search)

    try {
      setIsLoading(true)
      const response = await fetch(`/api/applications?${params.toString()}`)
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

  const handleAccepted = async (applicationId: string, isAlreadyAccepted: boolean) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/applications/${applicationId}/accept`, {
        method: isAlreadyAccepted ? 'DELETE' : 'PUT',
      })
      if (response.status === 200) {
        toast.success('La candidature est placée dans vos favoris')
        await fetchApplications()
      } else {
        toast.error('Une erreur est survenue pendant la mise en favoris')
        setIsError(true)
      }
    } catch (err) {
      toast.error('Une erreur est survenue pendant la mise en favoris')
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
        // TODO: handle email rejection
        toast.success('La candidature a été rejetée')
        await fetchApplications()
      } else {
        toast.error('Une erreur est survenue')
        setIsError(true)
      }
    } catch (err) {
      toast.error('Une erreur est survenue')
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return { applications, fetchApplications, handleAccepted, handleRejected, isError, isLoading }
}
