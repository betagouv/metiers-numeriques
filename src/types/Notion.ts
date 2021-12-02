export type NotionResponseError = {
  code: string
  message: string
  object: 'error'
  status: number
}

export type NotionDatabaseItem<
  T = {
    [key: string]: NotionDatabaseItemProperty
  },
> = {
  archived: boolean
  cover: null
  /** ISO date string */
  created_time: string
  icon: null
  /** UUID v4 */
  id: string
  /** ISO date string */
  last_edited_time: string
  object: 'page'
  parent: {
    /** UUID v4 */
    database_id: string
    type: 'database_id'
  }
  properties: T
  url: string
}

export type NotionDatabaseItemProperty =
  | NotionDatabaseItemPropertyAsCheckbox
  | NotionDatabaseItemPropertyAsCreatedTime
  | NotionDatabaseItemPropertyAsDate
  | NotionDatabaseItemPropertyAsEmail
  | NotionDatabaseItemPropertyAsFiles
  | NotionDatabaseItemPropertyAsLastEditedTime
  | NotionDatabaseItemPropertyAsMultiSelect
  | NotionDatabaseItemPropertyAsNumber
  | NotionDatabaseItemPropertyAsPeople
  | NotionDatabaseItemPropertyAsRichText
  | NotionDatabaseItemPropertyAsSelect
  | NotionDatabaseItemPropertyAsTitle
  | NotionDatabaseItemPropertyAsUrl

export type NotionDatabaseItemPropertyAsCheckbox = {
  checkbox: boolean
  id: string
  type: 'checkbox'
}

export type NotionDatabaseItemPropertyAsCreatedTime = {
  /** ISO date string */
  created_time: string
  id: string
  type: 'created_time'
}

export type NotionDatabaseItemPropertyAsDate = {
  date: {
    /** ISO date string */
    end: string | null
    /** ISO date string */
    start: string | null
  } | null
  id: string
  type: 'date'
}

export type NotionDatabaseItemPropertyAsEmail = {
  email: string | null
  id: string
  type: 'email'
}

export type NotionDatabaseItemPropertyAsFiles = {
  files: Array<
    | {
        external: {
          url: string
        }
        /** Seem to be the same as `external.url` and can be anything, including a website link. */
        name: string
        type: 'external'
      }
    | {
        file: {
          /** ISO date string */
          expiry_time: string
          url: string
        }
        name: string
        type: 'file'
      }
  >
  id: string
  type: 'files'
}

export type NotionDatabaseItemPropertyAsLastEditedTime = {
  id: string
  /** ISO date string */
  last_edited_time: string
  type: 'last_edited_time'
}

export type NotionDatabaseItemPropertyAsMultiSelect = {
  id: string
  multi_select: Array<{
    color: string
    /** UUID v4 */
    id: string
    name: string
  }>
  type: 'multi_select'
}

export type NotionDatabaseItemPropertyAsNumber = {
  id: string
  number: number | null
  type: 'number'
}

export type NotionDatabaseItemPropertyAsPeople = {
  id: string
  people: Array<{
    /** UUID v4 */
    id: string
    object: 'user'
  }>
  type: 'people'
}

export type NotionDatabaseItemPropertyAsRichText = {
  id: string
  rich_text: Array<{
    annotations: {
      bold: boolean
      code: boolean
      color: string
      italic: boolean
      strikethrough: boolean
      underline: boolean
    }
    href: null
    plain_text: string
    text: {
      content: string
      link: null
    }
    type: 'text'
  }>
  type: 'rich_text'
}

export type NotionDatabaseItemPropertyAsSelect = {
  id: string
  select: {
    color: string
    /** UUID v4 */
    id: string
    name: string
  } | null
  type: 'select'
}

export type NotionDatabaseItemPropertyAsTitle = {
  id: string
  title: Array<{
    annotations: {
      bold: boolean
      code: boolean
      color: string
      italic: boolean
      strikethrough: boolean
      underline: boolean
    }
    href: null
    plain_text: string
    text: {
      content: string
      link: null
    }
    type: 'text'
  }>
  type: 'title'
}

export type NotionDatabaseItemPropertyAsUrl = {
  id: string
  type: 'url'
  url: string
}
