import handleError from '@common/helpers/handleError'

import getPrisma from './getPrisma'

// Optimize subsequent requests once it's `true`
let IS_READY = false

export default async function isReady(): Promise<boolean> {
  try {
    if (!IS_READY) {
      const usersCount = await getPrisma().user.count()

      IS_READY = usersCount > 0
    }

    return IS_READY
  } catch (err) {
    handleError(err, 'api/helpers/isReady()')

    return false
  }
}
