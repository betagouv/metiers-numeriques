/* eslint-disable no-shadow */

import axios from 'axios'

import { NotionJob } from '../../types/NotionJob'
import { NotionMinistry } from '../../types/NotionMinistry'
import { NotionPepJob } from '../../types/NotionPepJob'
import { NotionSkbJob } from '../../types/NotionSkbJob'
import { SeekubeJobNormalized } from '../../types/Seekube'
import NotionDatabase from './NotionDatabase'
import NotionPage from './NotionPage'

const {
  NOTION_JOBS_DATABASE_ID,
  NOTION_MINISTRIES_DATABASE_ID,
  NOTION_PEP_JOBS_DATABASE_ID,
  NOTION_SKB_JOBS_DATABASE_ID,
  NOTION_TOKEN,
} = process.env as {
  [key: string]: string
}

class Notion {
  public database: NotionDatabase
  public page: NotionPage

  constructor() {
    const axiosInstance = axios.create({
      baseURL: 'https://api.notion.com/v1',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2021-08-16',
      },
    })

    this.database = new NotionDatabase(axiosInstance)
    this.page = new NotionPage(axiosInstance)
  }

  async countPepJob(offerId: string): Promise<number> {
    return this.database.count(NOTION_PEP_JOBS_DATABASE_ID, {
      property: 'OfferID',
      text: {
        equals: offerId,
      },
    })
  }

  async createSkbJob(data: SeekubeJobNormalized): Promise<void> {
    return this.page.create(NOTION_SKB_JOBS_DATABASE_ID, data)
  }

  async findSkbJob(id: string): Promise<NotionSkbJob | null> {
    return this.database.find(NOTION_SKB_JOBS_DATABASE_ID, {
      property: 'ID',
      text: {
        equals: id,
      },
    })
  }

  async findManyJobs(): Promise<NotionJob[]> {
    return this.database.findMany(NOTION_JOBS_DATABASE_ID, {
      property: 'redaction_status',
      select: {
        equals: 'published',
      },
    })
  }

  async findManyMinistries(): Promise<NotionMinistry[]> {
    return this.database.findMany(NOTION_MINISTRIES_DATABASE_ID)
  }

  async findManyPepJobs(): Promise<NotionPepJob[]> {
    return this.database.findMany(NOTION_PEP_JOBS_DATABASE_ID, {
      checkbox: {
        equals: false,
      },
      property: 'hide',
    })
  }

  async findManySkbJobs(): Promise<NotionSkbJob[]> {
    return this.database.findMany(NOTION_SKB_JOBS_DATABASE_ID, {
      checkbox: {
        equals: true,
      },
      property: 'EstPublie',
    })
  }

  async hasPepJob(id: string): Promise<boolean> {
    return this.database.has(NOTION_PEP_JOBS_DATABASE_ID, {
      property: 'OfferID',
      text: {
        equals: id,
      },
    })
  }

  async hasSkbJob(id: string): Promise<boolean> {
    return this.database.has(NOTION_SKB_JOBS_DATABASE_ID, {
      property: 'ID',
      text: {
        equals: id,
      },
    })
  }
}

export default new Notion()
