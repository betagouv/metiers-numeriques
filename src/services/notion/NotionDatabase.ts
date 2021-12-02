/* eslint-disable no-shadow */

import { AxiosInstance } from 'axios'

import handleError from '../../helpers/handleError'
import { NotionDatabaseItem } from '../../types/Notion'

export default class NotionDatabase {
  private axiosInstance: AxiosInstance

  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance
  }

  public async count(databaseId: string, filter?: any): Promise<number> {
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

  public async find<T extends NotionDatabaseItem>(databaseId: string, filter?: any): Promise<T | null> {
    try {
      const { data } = await this.axiosInstance.post<{
        results: T[]
      }>(
        `/databases/${databaseId}/query`,
        filter
          ? {
              filter,
            }
          : {},
      )

      if (data.results.length === 0) {
        return null
      }

      return data.results[0]
    } catch (err) {
      handleError(err, 'services/Notion.database.findMany()')
    }
  }

  public async findMany<T extends NotionDatabaseItem>(databaseId: string, filter?: any): Promise<T[]> {
    try {
      const { data } = await this.axiosInstance.post<{
        results: T[]
      }>(
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

  public async has(databaseId: string, filter: any): Promise<boolean> {
    try {
      const count = await this.count(databaseId, filter)

      return Boolean(count)
    } catch (err) {
      handleError(err, 'services/Notion.database.has()')
    }
  }

  public async list<T = any>(): Promise<T[]> {
    try {
      const { data } = await this.axiosInstance.get<{
        results: T[]
      }>(`/databases`)

      return data.results
    } catch (err) {
      handleError(err, 'services/Notion.database.list()')
    }
  }
}
