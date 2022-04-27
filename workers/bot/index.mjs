/* eslint-disable no-await-in-loop, no-continue */

import ß from 'bhala'

export default async function BotJob() {
  try {
    ß.info('[workers/bot] Starting…')

    ß.info('[workers/bot] Done.')
  } catch (err) {
    ß.error(`[workers/bot] ${err}`)
    console.error(err)
  }
}
