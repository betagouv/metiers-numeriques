import AdminHeader from '@app/atoms/AdminHeader'
import { Flex } from '@app/atoms/Flex'
import Title from '@app/atoms/Title'
import { AdminFigure } from '@app/molecules/AdminFigure'
import { UserRole } from '@prisma/client'
import { createWorkerFactory, terminate, useWorker } from '@shopify/react-web-worker'
import { useAuth } from 'nexauth/client'
import { useCallback, useEffect, useState } from 'react'
import { Send, Users } from 'react-feather'

import type { Statistics } from '@app/workers/statistics'

const createStatisticsWorker = createWorkerFactory(() => import('../../app/workers/statistics'))

export default function AdminDashboardPage() {
  const [statistics, setStatistics] = useState<Statistics>({
    activeJobsCount: undefined,
    newApplicationsCount: undefined,
    newVisitsCount: undefined,
  })
  const auth = useAuth<Common.Auth.User>()
  const statisticsWorker = useWorker(createStatisticsWorker)

  const updateStatitics = useCallback(async () => {
    if (auth.user === undefined || auth.user.role !== UserRole.ADMINISTRATOR) {
      return
    }

    const newStatistics = await statisticsWorker.get(auth.state.accessToken)

    setStatistics({ ...newStatistics })
  }, [auth.user])

  useEffect(() => {
    updateStatitics()

    const timerId = setInterval(updateStatitics, 5000)

    return () => {
      clearInterval(timerId)

      terminate(statisticsWorker)
    }
  }, [])

  return (
    <>
      <AdminHeader>
        <Title>Tableau de bord</Title>
      </AdminHeader>

      <Flex>
        <AdminFigure Icon={Users} label="Visites (30J)" value={statistics.newVisitsCount} />
        <AdminFigure Icon={Send} label="Candidatures (30J)" value={statistics.newApplicationsCount} />
        <AdminFigure Icon={Send} label="Offres Actives" value={statistics.activeJobsCount} />
      </Flex>
    </>
  )
}
