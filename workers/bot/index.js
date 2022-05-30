import { B } from 'bhala'

export default async function BotJob() {
  try {
    B.info('[workers/bot] Starting…')

    B.info('[workers/bot] Done.')
  } catch (err) {
    B.error(`[workers/bot] ${err}`)
    console.error(err)
  }
}
