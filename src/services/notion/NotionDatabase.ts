/* eslint-disable no-shadow */

import { AxiosInstance } from 'axios'

import handleError from '../../helpers/handleError'
import { NotionDatabaseItem } from '../../types/Notion'

export default class NotionDatabase {
  private axiosInstance: AxiosInstance

  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance
  }

  async count(databaseId: string, filter?: any): Promise<number> {
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

  async findMany<T extends NotionDatabaseItem>(databaseId: string, filter?: any): Promise<T[]> {
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

  async has(databaseId: string, filter: any): Promise<boolean> {
    try {
      const count = await this.count(databaseId, filter)

      return Boolean(count)
    } catch (err) {
      handleError(err, 'services/Notion.database.has()')
    }
  }

  async list<T = any>(): Promise<T[]> {
    try {
      const { data } = await this.axiosInstance.get(`/databases`)

      return data.results
    } catch (err) {
      handleError(err, 'services/Notion.database.list()')
    }
  }
}
