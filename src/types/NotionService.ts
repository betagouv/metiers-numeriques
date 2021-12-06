import {
  NotionDatabaseItem,
  NotionPropertyAsRichText,
  NotionPropertyAsSelect,
  NotionPropertyAsRelation,
  NotionPropertyAsTitle,
  NotionPropertyAsUrl,
} from './Notion'

export type NotionService = NotionDatabaseItem<{
  Institution: NotionPropertyAsRelation
  Lien: NotionPropertyAsUrl
  Nom: NotionPropertyAsTitle
  NomComplet: NotionPropertyAsRichText
  Region: NotionPropertyAsSelect
  'Related to Emplois (Property 1)': NotionPropertyAsRelation
}>
