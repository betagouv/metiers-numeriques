/* eslint-disable no-shadow */

import { AxiosError, AxiosInstance } from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import handleError from '../../helpers/handleError'
import { NotionDatabaseItem, NotionResponseError } from '../../types/Notion'

dayjs.extend(utc)

const { NOTION_JOBS_DATABASE_ID, NOTION_PEP_JOBS_DATABASE_ID, NOTION_SKB_JOBS_DATABASE_ID } = process.env as {
  [key: string]: string
}

const getPageTypeFromData = (
  data: NotionDatabaseItem,
): 'NOTION_JOB' | 'NOTION_PEP_JOB' | 'NOTION_SKB_JOB' | 'UNKNOWN' => {
  switch (data.parent.database_id.replace(/-/g, '')) {
    case NOTION_JOBS_DATABASE_ID:
      return 'NOTION_JOB'

    case NOTION_PEP_JOBS_DATABASE_ID:
      return 'NOTION_PEP_JOB'

    case NOTION_SKB_JOBS_DATABASE_ID:
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

  public async create(databaseId: string, data: { [key: string]: boolean | Date | number | string }): Promise<void> {
    try {
      const properties = this.convertPrimitivePropsToNotionProps(data)

      await this.axiosInstance.post(`/pages`, {
        parent: {
          database_id: databaseId,
        },
        properties,
      })
    } catch (err) {
      handleError(err, 'services/Notion.page.create()')
    }
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
        (err as AxiosError<NotionResponseError>).response?.data?.status === 404
      ) {
        return null
      }

      handleError(err, 'services/Notion.page.findById()')
    }
  }

  private convertPrimitivePropsToNotionProps(primitiveObject: {
    [key: string]: boolean | Date | number | string
  }): NotionDatabaseItem['properties'] {
    try {
      const primitiveObjectKeys = Object.keys(primitiveObject)

      const notionObjectProperties: NotionDatabaseItem['properties'] = primitiveObjectKeys.reduce((properties, key) => {
        const value = primitiveObject[key]

        switch (true) {
          case typeof value === 'boolean':
            return {
              ...properties,
              [key]: {
                checkbox: value as boolean,
                type: 'checkbox',
              },
            }

          case value instanceof Date:
            if (dayjs(value as Date).unix() === 0) {
              return {
                ...properties,
                [key]: {
                  date: null,
                  type: 'date',
                },
              }
            }

            return {
              ...properties,
              [key]: {
                date: {
                  start: dayjs(value as Date)
                    .local()
                    .format(),
                },
                type: 'date',
              },
            }

          case typeof value === 'number':
            return {
              ...properties,
              [key]: {
                number: value as number,
                type: 'number',
              },
            }

          case typeof value === 'string' && key === 'Email':
            return {
              ...properties,
              [key]: {
                email: value as string,
                type: 'email',
              },
            }

          case typeof value === 'string' && key === 'Titre':
            return {
              ...properties,
              [key]: {
                title: [
                  {
                    text: {
                      content: value as string,
                    },
                  },
                ],
                type: 'title',
              },
            }

          case typeof value === 'string':
            // Notion is limited to a maximum length of 2,000 characters per rich text chunk
            // EOLs are temporarely replaced by "$" to handle multiline strings
            // eslint-disable-next-line no-case-declarations
            const maybeValueChunks = (value as string).replace(/\n/g, '$').match(/.{1,2000}/g)
            if (maybeValueChunks === null) {
              return {
                ...properties,
                [key]: {
                  rich_text: [],
                  type: 'rich_text',
                },
              }
            }

            return {
              ...properties,
              [key]: {
                rich_text: maybeValueChunks.map(valueChunk => ({
                  text: {
                    content: valueChunk.replace(/\$/g, '\n'),
                  },
                })),
                type: 'rich_text',
              },
            }

          default:
            throw new Error('This primitive type is not supported.')
        }
      }, {})

      return notionObjectProperties
    } catch (err) {
      handleError(err, 'services/Notion.database.convertPrimitivePropsToNotionProps()')
    }
  }

  public async update(pageId: string, data: { [key: string]: boolean | Date | number | string }): Promise<void> {
    try {
      const properties = this.convertPrimitivePropsToNotionProps(data)

      await this.axiosInstance.patch(`/pages/${pageId}`, {
        properties,
      })
    } catch (err) {
      handleError(err, 'services/Notion.page.update()')
    }
  }
}
