import { AdminHeader } from '@app/atoms/AdminHeader'
import { Alert } from '@app/atoms/Alert'
import { Subtitle } from '@app/atoms/Subtitle'
import { Title } from '@app/atoms/Title'
import { AdminFigure } from '@app/molecules/AdminFigure'
import { UserRole } from '@prisma/client'
import { createWorkerFactory, terminate, useWorker } from '@shopify/react-web-worker'
import { useAuth } from 'nexauth/client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Briefcase, Send, Users } from 'react-feather'
import { Flex } from 'reflexbox'

import type { GlobalStatistics, LocalStatistics } from '@app/workers/statistics'
import type { Recruiter } from '@prisma/client'

const createStatisticsWorker = createWorkerFactory(() => import('../../app/workers/statistics'))
const createAlertWorker = createWorkerFactory(() => import('../../app/workers/alert'))

export default function AdminDashboardPage() {
  const $timerId = useRef<number>()
  const [globalStatistics, setGlobalStatistics] = useState<GlobalStatistics>({
    activeJobsCount: undefined,
    newApplicationsCount: undefined,
    newVisitsCount: undefined,
  })
  const [localStatistics, setLocalStatistics] = useState<LocalStatistics>({
    activeJobsCount: undefined,
    institution: undefined,
  })
  const [institutionlessRecruiters, setInstitutionlessRecruiters] = useState<Recruiter[]>([])
  const auth = useAuth<Common.Auth.User>()
  const alertWorker = useWorker(createAlertWorker)
  const statisticsWorker = useWorker(createStatisticsWorker)

  const goToRecruiter = useCallback(recruiterId => {
    window.open(`/admin/recruiter/${recruiterId}`, '_blank')
  }, [])

  const updateStatitics = useCallback(async () => {
    if (auth.user === undefined) {
      return
    }

    const newStatistics = await statisticsWorker.getGlobal(auth.state.accessToken)

    setGlobalStatistics({ ...newStatistics })

    if (auth.user.role === UserRole.RECRUITER) {
      const newLocalStatistics = await statisticsWorker.getLocal(auth.state.accessToken, auth.user.institutionId)

      setLocalStatistics({ ...newLocalStatistics })
    }

    if (auth.user.role === UserRole.ADMINISTRATOR) {
      const newInstitutionlessRecruiters = await alertWorker.getInstitutionlessRecruiters(auth.state.accessToken)

      setInstitutionlessRecruiters(newInstitutionlessRecruiters)
    }

    $timerId.current = setTimeout(updateStatitics, 1000) as unknown as number
  }, [auth.state.accessToken])

  useEffect(() => {
    updateStatitics()

    return () => {
      clearTimeout($timerId.current)

      terminate(alertWorker)
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

      {auth.user.role === UserRole.ADMINISTRATOR && institutionlessRecruiters.length !== 0 && (
        <>
          <Subtitle noBorder>Services recruteurs non liés</Subtitle>
          {institutionlessRecruiters.map(({ displayName, id }, index) => (
            <Alert key={id} isFirst={index === 0} onClick={() => goToRecruiter(id)}>
              {displayName}
            </Alert>
          ))}
        </>
      )}
    </>
  )
}
