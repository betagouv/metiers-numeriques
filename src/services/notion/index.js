/* eslint-disable no-shadow */

const axios = require('axios')

const NotionDatabase = require('./NotionDatabase')

const { NOTION_MINISTRIES_DATABASE_ID, NOTION_TOKEN, PEP_DATABASE_ID } = process.env

class Notion {
  constructor() {
    const axiosInstance = axios.default.create({
      baseURL: 'https://api.notion.com/v1',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2021-08-16',
      },
    })

    /** @type {NotionDatabase} */
    this.database = new NotionDatabase(axiosInstance)
  }

  /**
   * @param {string} offerId
   * @returns {Promise<number>}
   */
  async countPepJob(offerId) {
    return this.database.count(PEP_DATABASE_ID, {
      property: 'OfferID',
      text: {
        equals: offerId,
      },
    })
  }

  /**
   * @returns {Promise<*[]>}
   */
  async findManyJobs() {
    return this.database.findMany(NOTION_MINISTRIES_DATABASE_ID)
  }

  /**
   * @param {string} offerId
   * @returns {Promise<boolean>}
   */
  async hasPepJob(offerId) {
    return this.database.has(PEP_DATABASE_ID, {
      property: 'OfferID',
      text: {
        equals: offerId,
      },
    })
  }
}

module.exports = new Notion()
