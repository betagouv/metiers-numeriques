/* eslint-disable no-await-in-loop, no-continue */

import ß from 'bhala'
import http from 'http'
import https from 'https'

const { API_SECRET, DOMAIN_URL } = process.env

/**
 * @param {string} path
 *
 * @returns {Promise<{
 *   data: any
 *   hasError: false
 * } | {
 *   hasError: true
 *   message: string
 * }>}
 */
const fetch = async path => {
  if (API_SECRET === undefined) {
    throw new Error('`API_KEY` is undefined.')
  }
  if (DOMAIN_URL === undefined) {
    throw new Error('`DOMAIN_URL` is undefined.')
  }

  const url = `${DOMAIN_URL}/api${path}`
  const protocol = url.startsWith('https') ? https : http

  return new Promise((resolve, reject) => {
    protocol
      .get(
        url,
        {
          headers: {
            'x-api-secret': API_SECRET,
          },
          timeout: 10000,
        },
        res => {
          const dataAsBuffer = []

          res.on('data', chunk => {
            dataAsBuffer.push(chunk)
          })

          res.on('end', () => {
            const data = JSON.parse(Buffer.concat(dataAsBuffer).toString())

            resolve(data)
          })
        },
      )
      .on('error', err => {
        reject(err)
      })
  })
}

export default async function PepJob() {
  ß.info('[pep] Synchronizing jobs…')

  try {
    const res = await fetch('/pep/synchronize')
    if (res.hasError) {
      throw new Error(res.message)
    }

    ß.info('[pep]', `${res.data.count} job(s) synchronized.`)
  } catch (err) {
    ß.error('[pep]', err)
    console.error(err)
  }
}
