import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import { AdminProgressCard } from '@app/molecules/AdminProgressCard'
import { UserRole } from '@prisma/client'
import { createWorkerFactory, terminate, useWorker } from '@shopify/react-web-worker'
import { useAuth } from 'nexauth/client'
import { useCallback, useEffect, useState } from 'react'

import type { AdminProgressCardDataProps } from '@app/molecules/AdminProgressCard'

const createStatisticsWorker = createWorkerFactory(() => import('../../app/workers/statistics'))

export default function AdminDashboardPage() {
  const [jobsStatisticsData, setJobsStatisticsData] = useState<AdminProgressCardDataProps[]>([])
  const auth = useAuth<Common.Auth.User>()
  const statisticsWorker = useWorker(createStatisticsWorker)

  const loadJobsStatitics = useCallback(async () => {
    if (auth.user === undefined || auth.user.role !== UserRole.ADMINISTRATOR) {
      return
    }

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
  }, [auth.user])

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

      {auth.user?.role === UserRole.ADMINISTRATOR && (
        <AdminProgressCard data={jobsStatisticsData} title="Offres d’emploi" />
      )}
    </>
  )
}
