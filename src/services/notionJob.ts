/* eslint-disable no-shadow */

import axios from 'axios'

import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import { formatDetailFromPep, mapToJob } from '../legacy/infrastructure/mappers'
import { createPepProperties } from '../legacy/utils'

class NotionJob {
  async all(
    options: {
      pageSize?: number
      startCursor?: string
    } = {},
  ): Promise<any> {
    const finalOptions = {
      ...{
        pageSize: 20,
      },
      ...options,
    }
    const { pageSize, startCursor } = finalOptions

    let jobs = []
    let jobsPep = []
    let nextCursor
    let hasMore

    if (startCursor === undefined || !startCursor.startsWith('pep-')) {
      if (startCursor === undefined) {
        const cachedResult = await cache.getOrCacheWith('JOBS.DEFAULT', async () => {
          const { data } = await axios.post(
            `https://api.notion.com/v1/databases/${process.env.NOTION_JOBS_DATABASE_ID}/query`,
            {
              filter: {
                property: 'redaction_status',
                select: {
                  equals: 'published',
                },
              },
              page_size: pageSize,
              start_cursor: startCursor,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
                'Notion-Version': '2021-08-16',
              },
            },
          )

          const jobs = data.results.map(mapToJob)
          const nextCursor = data.next_cursor

          return {
            jobs,
            nextCursor,
          }
        })

        jobs = cachedResult.jobs
        nextCursor = cachedResult.nextCursor
      } else {
        const { data } = await axios.post(
          `https://api.notion.com/v1/databases/${process.env.NOTION_JOBS_DATABASE_ID}/query`,
          {
            filter: {
              property: 'redaction_status',
              select: {
                equals: 'published',
              },
            },
            page_size: pageSize,
            start_cursor: startCursor,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
              'Notion-Version': '2021-08-16',
            },
          },
        )

        jobs = data.results.map(mapToJob)
        nextCursor = data.next_cursor
      }
    }

    if (jobs.length < 20) {
      const startPepCursor = startCursor && startCursor.startsWith('pep-') ? startCursor.replace('pep-', '') : undefined
      const { data } = await axios.post(
        `https://api.notion.com/v1/databases/${process.env.NOTION_PEP_JOBS_DATABASE_ID}/query`,
        {
          filter: {
            checkbox: {
              equals: false,
            },
            property: 'hide',
          },
          page_size: 20 - jobs.length,
          start_cursor: startPepCursor,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
            'Notion-Version': '2021-08-16',
          },
        },
      )
      jobsPep = data.results.map(item => formatDetailFromPep(item))
      nextCursor = `pep-${data.next_cursor}`
      hasMore = data.has_more
    }

    return {
      hasMore,
      jobs: [...jobs, ...jobsPep],
      nextCursor,
    }
    // return data.results.map(mapToJob);
  }

  async count() {
    const { data } = await axios.post(
      `https://api.notion.com/v1/databases/${process.env.NOTION_JOBS_DATABASE_ID}/query`,
      {
        filter: {
          property: 'redaction_status',
          select: {
            equals: 'published',
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2021-08-16',
        },
      },
    )

    const count = data.results.length

    const { data: pepData } = await axios.post(
      `https://api.notion.com/v1/databases/${process.env.NOTION_PEP_JOBS_DATABASE_ID}/query`,
      {
        filter: {
          checkbox: {
            equals: false,
          },
          property: 'hide',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2021-08-16',
        },
      },
    )
    const countPep = pepData.results.length

    return count + countPep
  }

  async createPage(database, properties) {
    const pepProperties = createPepProperties(properties)
    try {
      await axios.post(
        `https://api.notion.com/v1/pages`,
        {
          parent: { database_id: database },
          properties: pepProperties,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
            'Notion-Version': '2021-08-16',
          },
        },
      )
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      throw new Error('Impossible de crééer une page')
    }
  }

  async get(pageId: string, tag?: string) {
    const mapper = tag === 'pep' ? formatDetailFromPep : mapToJob
    let result
    try {
      result = await axios.get(`https://api.notion.com/v1/pages/${pageId}`, {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2021-08-16',
        },
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }

    if (result) {
      return mapper(result.data)
    }

    return null
  }

  async getPage(database, pageId) {
    try {
      const { data } = await axios.post(
        `https://api.notion.com/v1/databases/${database}/query`,
        {
          filter: {
            property: 'OfferID',
            text: {
              equals: pageId,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
            'Notion-Version': '2021-08-16',
          },
        },
      )
      if (data.results.length) {
        return data.results[0]
      }

      return null
    } catch (err) {
      handleError(err, 'services/NotionJob.getPage()')
    }
  }
}

export default new NotionJob()
