export enum MatomoGoal {
  NEW_JOB_APPLICATION = 1,
  JOB_OPENING = 2,
}

export const matomo = {
  trackGoal: (matoomoGoal: MatomoGoal) => {
    if (window === undefined || (window as any)._paq === undefined) {
      return
    }

    ;(window as any)._paq.push(['trackGoal', matoomoGoal])
  },
}
