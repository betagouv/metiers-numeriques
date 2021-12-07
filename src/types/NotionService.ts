import {
  NotionDatabaseItem,
  NotionPropertyAsRichText,
  NotionPropertyAsSelect,
  NotionPropertyAsRelation,
  NotionPropertyAsTitle,
  NotionPropertyAsUrl,
} from './Notion'

export type NotionService = NotionDatabaseItem<{
  Entite: NotionPropertyAsRelation
  Lien: NotionPropertyAsUrl
  Nom: NotionPropertyAsTitle
  NomComplet: NotionPropertyAsRichText
  Region: NotionPropertyAsSelect
}>
