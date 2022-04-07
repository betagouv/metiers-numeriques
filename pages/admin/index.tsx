import AdminHeader from '@app/atoms/AdminHeader'
import { Subtitle } from '@app/atoms/Subtitle'
import Title from '@app/atoms/Title'
import { AdminFigure } from '@app/molecules/AdminFigure'
import { UserRole } from '@prisma/client'
import { createWorkerFactory, terminate, useWorker } from '@shopify/react-web-worker'
import { useAuth } from 'nexauth/client'
import { useCallback, useEffect, useState } from 'react'
import { Briefcase, Send, Users } from 'react-feather'
import { Flex } from 'reflexbox'

import type { GlobalStatistics, LocalStatistics } from '@app/workers/statistics'

const createStatisticsWorker = createWorkerFactory(() => import('../../app/workers/statistics'))

export default function AdminDashboardPage() {
  const [globalStatistics, setGlobalStatistics] = useState<GlobalStatistics>({
    activeJobsCount: undefined,
    newApplicationsCount: undefined,
    newVisitsCount: undefined,
  })
  const [localStatistics, setLocalStatistics] = useState<LocalStatistics>({
    activeJobsCount: undefined,
    institution: undefined,
  })
  const auth = useAuth<Common.Auth.User>()
  const statisticsWorker = useWorker(createStatisticsWorker)

  const updateStatitics = useCallback(async () => {
    if (auth.user === undefined) {
      return
    }

    const newStatistics = await statisticsWorker.getGlobal(auth.state.accessToken)

    setGlobalStatistics({ ...newStatistics })

    if (auth.user.role === UserRole.RECRUITER) {
      const newLocalStatistics = await statisticsWorker.getLocal(auth.state.accessToken, auth.user.recruiterId)

      setLocalStatistics({ ...newLocalStatistics })
    }
  }, [auth.user])

  useEffect(() => {
    updateStatitics()

    const timerId = setInterval(updateStatitics, 5000)

    return () => {
      clearInterval(timerId)

      terminate(statisticsWorker)
    }
  }, [])

  if (auth.user === undefined) {
    return null
  }

  return (
    <>
      <AdminHeader>
        <Title>Tableau de bord</Title>
      </AdminHeader>

      <Subtitle isFirst noBorder>
        Global
      </Subtitle>
      <Flex>
        <AdminFigure Icon={Briefcase} label="Offres Actives" value={globalStatistics.activeJobsCount} />
        <AdminFigure Icon={Send} label="Candidatures (30J)" value={globalStatistics.newApplicationsCount} />
        <AdminFigure Icon={Users} label="Visites (30J)" value={globalStatistics.newVisitsCount} />
      </Flex>

      {auth.user.role === UserRole.RECRUITER && localStatistics.institution !== undefined && (
        <>
          <Subtitle noBorder>{localStatistics.institution.name}</Subtitle>
          <Flex>
            <AdminFigure Icon={Briefcase} label="Offres Actives" value={localStatistics.activeJobsCount} />
          </Flex>
        </>
      )}
    </>
  )
}
