import { AdminHeader } from '@app/atoms/AdminHeader'
import { AdminTitle } from '@app/atoms/AdminTitle'
import { Alert } from '@app/atoms/Alert'
import { Subtitle } from '@app/atoms/Subtitle'
import { humanizeDate } from '@app/helpers/humanizeDate'
import { AdminFigure } from '@app/molecules/AdminFigure'
import { UserRole } from '@prisma/client'
import { createWorkerFactory, terminate, useWorker } from '@shopify/react-web-worker'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Briefcase, Send, Users } from 'react-feather'
import { Flex } from 'reflexbox'

import type { GlobalStatistics, LocalStatistics } from '@app/workers/statistics'
import type { Recruiter, User } from '@prisma/client'

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
  const [lastInstitutionlessRecruiters, setLastInstitutionlessRecruiters] = useState<Recruiter[]>([])
  const [lastInstitutionlessRecruitersLength, setLastInstitutionlessRecruitersLength] = useState<number>(0)
  const [lastInactiveUsers, setLastInactiveUsers] = useState<User[]>([])
  const [lastInactiveUsersLength, setLastInactiveUsersLength] = useState<number>(0)
  const { data: auth } = useSession()
  const alertWorker = useWorker(createAlertWorker)
  const statisticsWorker = useWorker(createStatisticsWorker)

  const goToRecruiter = useCallback(recruiterId => {
    window.open(`/admin/recruiter/${recruiterId}`, '_blank')
  }, [])

  const goToUser = useCallback(userId => {
    window.open(`/admin/user/${userId}`, '_blank')
  }, [])

  const updateStatistics = async () => {
    if (!auth?.user) {
      return
    }

    const newStatistics = await statisticsWorker.getGlobal()

    setGlobalStatistics({ ...newStatistics })

    if (auth.user.role === UserRole.RECRUITER) {
      const newLocalStatistics = await statisticsWorker.getLocal(auth.user.institutionId)

      setLocalStatistics({ ...newLocalStatistics })
    }

    if (auth.user.role === UserRole.ADMINISTRATOR) {
      const lastInactiveUsersResult = await alertWorker.getLastInactiveUsers()
      const lastInstitutionlessRecruitersResult = await alertWorker.getInstitutionlessRecruiters()

      setLastInactiveUsers(lastInactiveUsersResult.data)
      setLastInactiveUsersLength(lastInactiveUsersResult.length)
      setLastInstitutionlessRecruiters(lastInstitutionlessRecruitersResult.data)
      setLastInstitutionlessRecruitersLength(lastInstitutionlessRecruitersResult.length)
    }
  }

  useEffect(() => {
    if ($timerId.current !== undefined) {
      clearInterval($timerId.current)
    }

    $timerId.current = setInterval(updateStatistics, 1000) as unknown as number

    return () => {
      clearInterval($timerId.current)

      terminate(alertWorker)
      terminate(statisticsWorker)
    }
  }, [updateStatistics])

  if (auth?.user === undefined) {
    return null
  }

  return (
    <>
      <AdminHeader>
        <AdminTitle>Tableau de bord</AdminTitle>
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

      {auth.user.role === UserRole.ADMINISTRATOR && lastInactiveUsers.length !== 0 && (
        <>
          <Subtitle noBorder>{`Dernières inscriptions (${lastInactiveUsersLength})`}</Subtitle>
          {lastInactiveUsers.map(({ createdAt, extra, firstName, id, lastName }, index) => (
            <Alert key={id} isFirst={index === 0} onClick={() => goToUser(id)}>
              {`${firstName} ${lastName} (${extra && (extra as any).requestedInstitution} / ${
                extra && (extra as any).requestedService
              }) le ${humanizeDate(createdAt)}.`}
            </Alert>
          ))}
        </>
      )}

      {auth.user.role === UserRole.ADMINISTRATOR && lastInstitutionlessRecruiters.length !== 0 && (
        <>
          <Subtitle
            noBorder
          >{`Services recruteurs sans institution (${lastInstitutionlessRecruitersLength})`}</Subtitle>
          {lastInstitutionlessRecruiters.map(({ displayName, id }, index) => (
            <Alert key={id} isFirst={index === 0} onClick={() => goToRecruiter(id)}>
              {displayName}
            </Alert>
          ))}
        </>
      )}
    </>
  )
}
