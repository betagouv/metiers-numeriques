import { init } from '@socialgouv/matomo-next'
import { useEffect } from 'react'

const MATOMO_URL = 'https://stats.data.gouv.fr/'
const MATOMO_SITE_ID = '191'

export function MatomoScript() {
  useEffect(() => {
    init({
      siteId: MATOMO_SITE_ID,
      url: MATOMO_URL,
    })
  }, [])

  return null
}
