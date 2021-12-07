import { NotionDatabaseItem, NotionPropertyAsRichText, NotionPropertyAsTitle } from './Notion'

export type NotionEntity = NotionDatabaseItem<{
  Nom: NotionPropertyAsTitle
  NomComplet: NotionPropertyAsRichText
}>
