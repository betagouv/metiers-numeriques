import { JobApplicationWithRelation } from '@app/libs/candidate'
import { handleError } from '@common/helpers/handleError'
import * as R from 'ramda'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import type { FilterProps } from './types'

export const useCandidatePoolQueries = (jobId?: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const [applications, setApplications] = useState<JobApplicationWithRelation[]>([])
  const [currentApplication, setCurrentApplication] = useState<JobApplicationWithRelation>()

  const fetchApplications = async (filters: FilterProps = {}): Promise<JobApplicationWithRelation[] | undefined> => {
    const search = R.reject(R.isNil, { ...filters, jobId })
    // @ts-expect-error
    const params = new URLSearchParams(search)

    try {
      setIsLoading(true)
      const response = await fetch(`/api/applications?${params.toString()}`)
      if (response.status !== 200) {
        setIsError(true)
      }

      const data = await response.json()

      setApplications(data)
      if (!currentApplication) {
        setCurrentApplication(data[0])
      }

      return data
    } catch (err) {
      handleError(err, 'pages/admin/domain/[id].tsx > fetchDomain()')
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccepted = async (applicationId: string, isAlreadyAccepted: boolean): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/applications/${applicationId}/accept`, {
        method: isAlreadyAccepted ? 'DELETE' : 'PUT',
      })

      if (response.status === 200) {
        toast.success(
          isAlreadyAccepted
            ? 'La candidature a été retirée de vos favoris'
            : 'La candidature est placée dans vos favoris',
        )

        const applications = await fetchApplications()
        if (applications) {
          setCurrentApplication(applications.find(application => application.id === applicationId))
        }
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

  const handleRejected = async (applicationId: string, rejectionReasons: string[]): Promise<void> => {
    const body = JSON.stringify({ rejectionReasons })
    try {
      setIsLoading(true)
      const response = await fetch(`/api/applications/${applicationId}/reject`, { body, method: 'PUT' })
      if (response.status === 200) {
        // TODO: handle email rejection
        toast.success('La candidature a été rejetée')

        const applications = await fetchApplications()
        if (applications) {
          setCurrentApplication(applications.find(application => application.id === applicationId))
        }
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

  return {
    applications,
    currentApplication,
    fetchApplications,
    handleAccepted,
    handleRejected,
    isError,
    isLoading,
    setCurrentApplication,
  }
}
