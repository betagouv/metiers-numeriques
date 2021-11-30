/* eslint-disable no-shadow */

const handleError = require('../../helpers/handleError')

class NotionDatabase {
  /**
   * @param {import('axios').AxiosInstance} axiosInstance
   */
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance
  }

  /**
   * @param {string} databaseId
   * @param {*=} filter
   * @returns {Promise<number>}
   */
  async count(databaseId, filter) {
    try {
      const { data } = await this.axiosInstance.post(
        `/databases/${databaseId}/query`,
        filter
          ? {
              filter,
            }
          : {},
      )

      return data.results.length
    } catch (err) {
      handleError(err, 'services/Notion.database.count()')
    }
  }

  /**
   * @param {string} databaseId
   * @param {*=} filter
   * @returns {Promise<*[]>}
   */
  async findMany(databaseId, filter) {
    try {
      const { data } = await this.axiosInstance.post(
        `/databases/${databaseId}/query`,
        filter
          ? {
              filter,
            }
          : {},
      )

      return data.results
    } catch (err) {
      handleError(err, 'services/Notion.database.findMany()')
    }
  }

  /**
   * @param {string} databaseId
   * @param {*} filter
   * @returns {Promise<boolean>}
   */
  async has(databaseId, filter) {
    try {
      const count = await this.count(databaseId, filter)

      return Boolean(count)
    } catch (err) {
      handleError(err, 'services/Notion.database.has()')
    }
  }

  /**
   * @returns {Promise<any[]>}
   *
   * @deprecated
   */
  async list() {
    try {
      const { data } = await this.axiosInstance.get(`/databases`)

      return data.results
    } catch (err) {
      handleError(err, 'services/Notion.database.list()')
    }
  }
}

module.exports = NotionDatabase
