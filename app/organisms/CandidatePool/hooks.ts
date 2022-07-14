import { handleError } from '@common/helpers/handleError'
import { JobContractType } from '@prisma/client'
import * as R from 'ramda'
import { useState } from 'react'

import { JobApplicationWithRelation } from './types'

// TODO dupe
type FilterProps = {
  contractTypes?: JobContractType[]
  domainIds?: string[]
  professionId?: string
  region?: string
}

export const useCandidatePoolQueries = (jobId?: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const [applications, setApplications] = useState<JobApplicationWithRelation[]>([])

  const fetchApplications = async (filters: FilterProps = {}) => {
    console.log('fff', filters)
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
