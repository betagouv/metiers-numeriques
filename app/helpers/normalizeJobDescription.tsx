import { handleError } from '@common/helpers/handleError'

import type { LegacyJob } from '@prisma/client'
import type { ReactElement } from 'react'

const getDescriptionSource = ({ mission, reference, tasks, team }: LegacyJob): string | ReactElement => {
  // console.log(mission)

  if (typeof mission === 'string' && mission.trim().length >= 50) {
    return mission
  }

  if (typeof tasks === 'string' && tasks.trim().length >= 50) {
    return tasks
  }

  if (typeof team === 'string' && team.trim().length >= 50) {
    return team
  }

  const subject = encodeURI(`[BUG] [JOB-DESC] #${reference}`)

  return (
    <>
      <strong>Description manquante ou erronée 😟 !</strong>
      Aidez-nous en nous le signalant par email à{' '}
      <a href={`mailto:contact@metiers.numerique.gouv.fr?subject=${subject}`} rel="noopener noreferrer" target="_blank">
        contact@metiers.numerique.gouv.fr
      </a>
      .
    </>
  )
}

export default function normalizeJobDescription(job: LegacyJob): string | ReactElement {
  try {
    return getDescriptionSource(job)
  } catch (err) {
    handleError(err, 'helpers/normalizeJobDescription()')

    return ''
  }
}
