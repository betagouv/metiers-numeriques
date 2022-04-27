/* eslint-disable no-await-in-loop, no-continue */

import ß from 'bhala'

import { generateSitemap } from './helpers/generateSitemap.mjs'

export default async function BotJob() {
  try {
    ß.info('[bot] Starting…')

    await generateSitemap()

    ß.info('[bot] Done.')
  } catch (err) {
    ß.error(`[bot] ${err}`)
    console.error(err)
  }
}
