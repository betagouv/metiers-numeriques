/* eslint-disable no-shadow */

import { AxiosError, AxiosInstance } from 'axios'

import handleError from '../../helpers/handleError'
import { NotionDatabaseItem, NotionError } from '../../types/Notion'

const { NOTION_JOBS_DATABASE_ID, PEP_DATABASE_ID, SKB_DATABASE_ID } = process.env as {
  [key: string]: string
}

const getPageTypeFromData = (
  data: NotionDatabaseItem,
): 'NOTION_JOB' | 'NOTION_PEP_JOB' | 'NOTION_SKB_JOB' | 'UNKNOWN' => {
  switch (data.parent.database_id.replace(/-/g, '')) {
    case NOTION_JOBS_DATABASE_ID:
      return 'NOTION_JOB'
    case PEP_DATABASE_ID:
      return 'NOTION_PEP_JOB'
    case SKB_DATABASE_ID:
      return 'NOTION_SKB_JOB'
    default:
      return 'UNKNOWN'
  }
}

export default class NotionPage {
  private axiosInstance: AxiosInstance

  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance
  }

  async findById<T extends NotionDatabaseItem>(
    pageId: string,
  ): Promise<{ data: T; type: 'NOTION_JOB' | 'NOTION_PEP_JOB' | 'NOTION_SKB_JOB' | 'UNKNOWN' } | null> {
    try {
      const { data } = await this.axiosInstance.get<T>(`/pages/${pageId}`)
      const type = getPageTypeFromData(data)

      return {
        data,
        type,
      }
    } catch (err) {
      if (
        err instanceof Error &&
        (err as AxiosError).isAxiosError &&
        (err as AxiosError<NotionError>).response?.data?.status === 404
      ) {
        return null
      }

      handleError(err, 'services/Notion.page.findById()')
    }
  }
}
