export type NotionResponseError = {
  code: string
  message: string
  object: 'error'
  status: number
}

export type NotionResponseList<T> = {
  has_more: boolean
  next_cursor: string
  object: 'list'
  results: T[]
}

export type NotionDatabaseItem<
  T = {
    [key: string]: NotionProperty
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

export type NotionProperty =
  | NotionPropertyAsCheckbox
  | NotionPropertyAsCreatedTime
  | NotionPropertyAsDate
  | NotionPropertyAsEmail
  | NotionPropertyAsFiles
  | NotionPropertyAsLastEditedTime
  | NotionPropertyAsMultiSelect
  | NotionPropertyAsNumber
  | NotionPropertyAsPeople
  | NotionPropertyAsRelation
  | NotionPropertyAsRichText
  | NotionPropertyAsSelect
  | NotionPropertyAsTitle
  | NotionPropertyAsUrl

export type NotionPropertyAsCheckbox = {
  checkbox: boolean
  id: string
  type: 'checkbox'
}

export type NotionPropertyAsCreatedTime = {
  /** ISO date string */
  created_time: string
  id: string
  type: 'created_time'
}

export type NotionPropertyAsDate = {
  date: {
    /** ISO date string */
    end: string | null
    /** ISO date string */
    start: string | null
  } | null
  id: string
  type: 'date'
}

export type NotionPropertyAsEmail = {
  email: string | null
  id: string
  type: 'email'
}

export type NotionPropertyAsFiles = {
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

export type NotionPropertyAsLastEditedTime = {
  id: string
  /** ISO date string */
  last_edited_time: string
  type: 'last_edited_time'
}

export type NotionPropertyAsMultiSelect = {
  id: string
  multi_select: Array<{
    color: string
    /** UUID v4 */
    id: string
    name: string
  }>
  type: 'multi_select'
}

export type NotionPropertyAsNumber = {
  id: string
  number: number | null
  type: 'number'
}

export type NotionPropertyAsPeople = {
  id: string
  people: Array<{
    /** UUID v4 */
    id: string
    object: 'user'
  }>
  type: 'people'
}

export type NotionPropertyAsRelation = {
  id: string
  relation: Array<{
    /** UUID v4 */
    id: string
  }>
  type: 'relation'
}

export type NotionPropertyAsRichText = {
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

export type NotionPropertyAsSelect = {
  id: string
  select: {
    color: string
    /** UUID v4 */
    id: string
    name: string
  } | null
  type: 'select'
}

export type NotionPropertyAsTitle = {
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

export type NotionPropertyAsUrl = {
  id: string
  type: 'url'
  url: string | null
}
