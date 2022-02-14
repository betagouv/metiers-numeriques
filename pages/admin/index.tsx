import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import { AdminProgressCard } from '@app/molecules/AdminProgressCard'
import { createWorkerFactory, terminate, useWorker } from '@shopify/react-web-worker'
import { useAuth } from 'nexauth/client'
import { useCallback, useEffect, useState } from 'react'

import type { AdminProgressCardDataProps } from '@app/molecules/AdminProgressCard'

const createStatisticsWorker = createWorkerFactory(() => import('../../app/workers/statistics'))

export default function AdminDashboardPage() {
  const [jobsStatisticsData, setJobsStatisticsData] = useState<AdminProgressCardDataProps[]>([])
  const auth = useAuth()
  const statisticsWorker = useWorker(createStatisticsWorker)

  const loadJobsStatitics = useCallback(async () => {
    const newJobsStatistics = await statisticsWorker.jobs(auth.state.accessToken)
    if (newJobsStatistics === undefined) {
      return
    }

    const newJobsStatisticsData: AdminProgressCardDataProps[] = [
      {
        count: newJobsStatistics.migrated.count,
        length: newJobsStatistics.migrated.length,
        title: 'offres migrées',
      },
      {
        count: newJobsStatistics.expired.count,
        length: newJobsStatistics.expired.length,
        title: 'offres expirées',
      },
    ]

    setJobsStatisticsData(newJobsStatisticsData)
  }, [])

  useEffect(() => {
    loadJobsStatitics()

    return () => {
      terminate(statisticsWorker)
    }
  }, [])

  return (
    <>
      <AdminHeader>
        <Title>Tableau de bord</Title>
      </AdminHeader>

      <AdminProgressCard data={jobsStatisticsData} title="Offres" />
    </>
  )
}
