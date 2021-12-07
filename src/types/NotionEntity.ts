import { NotionDatabaseItem, NotionPropertyAsRichText, NotionPropertyAsTitle, NotionPropertyAsUrl } from './Notion'

export type NotionEntity = NotionDatabaseItem<{
  Logo: NotionPropertyAsUrl
  Nom: NotionPropertyAsTitle
  NomComplet: NotionPropertyAsRichText
}>
