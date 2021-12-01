/* eslint-disable no-shadow */

import axios from 'axios'

import NotionDatabase from './NotionDatabase'

const { NOTION_MINISTRIES_DATABASE_ID, NOTION_TOKEN, PEP_DATABASE_ID } = process.env as {
  [key: string]: string
}

class Notion {
  public database: NotionDatabase

  constructor() {
    const axiosInstance = axios.create({
      baseURL: 'https://api.notion.com/v1',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2021-08-16',
      },
    })

    /** @type {NotionDatabase} */
    this.database = new NotionDatabase(axiosInstance)
  }

  async countPepJob(offerId: string): Promise<number> {
    return this.database.count(PEP_DATABASE_ID, {
      property: 'OfferID',
      text: {
        equals: offerId,
      },
    })
  }

  async findManyJobs<T = any>(): Promise<T[]> {
    return this.database.findMany(NOTION_MINISTRIES_DATABASE_ID)
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
