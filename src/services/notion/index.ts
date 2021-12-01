/* eslint-disable no-shadow */

import axios from 'axios'

import { NotionJob } from '../../types/NotionJob'
import { NotionMinistry } from '../../types/NotionMinistry'
import { NotionPepJob } from '../../types/NotionPepJob'
import NotionDatabase from './NotionDatabase'
import NotionPage from './NotionPage'

const { NOTION_JOBS_DATABASE_ID, NOTION_MINISTRIES_DATABASE_ID, NOTION_TOKEN, PEP_DATABASE_ID } = process.env as {
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
    return this.database.count(PEP_DATABASE_ID, {
      property: 'OfferID',
      text: {
        equals: offerId,
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
    return this.database.findMany(PEP_DATABASE_ID)
  }

  async hasPepJob(offerId: string): Promise<boolean> {
    return this.database.has(PEP_DATABASE_ID, {
      property: 'OfferID',
      text: {
        equals: offerId,
      },
    })
  }
}

export default new Notion()
