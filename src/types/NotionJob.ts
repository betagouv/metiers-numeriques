import {
  NotionDatabaseItem,
  NotionDatabaseItemPropertyAsDate,
  NotionDatabaseItemPropertyAsMultiSelect,
  NotionDatabaseItemPropertyAsRichText,
  NotionDatabaseItemPropertyAsSelect,
  NotionDatabaseItemPropertyAsTitle,
} from './Notion'

export type NotionJob = NotionDatabaseItem<{
  'Ce que vous ferez': NotionDatabaseItemPropertyAsRichText
  'Conditions particulières du poste': NotionDatabaseItemPropertyAsRichText
  Contact: NotionDatabaseItemPropertyAsRichText
  'Date de saisie': NotionDatabaseItemPropertyAsDate
  'Date limite': NotionDatabaseItemPropertyAsDate
  'Entité recruteuse': NotionDatabaseItemPropertyAsSelect
  Expérience: NotionDatabaseItemPropertyAsMultiSelect
  'Les plus du poste': NotionDatabaseItemPropertyAsRichText
  Localisation: NotionDatabaseItemPropertyAsMultiSelect
  Ministère: NotionDatabaseItemPropertyAsMultiSelect
  Mission: NotionDatabaseItemPropertyAsRichText
  Name: NotionDatabaseItemPropertyAsTitle
  'Poste ouvert aux': NotionDatabaseItemPropertyAsMultiSelect
  'Poste à pourvoir': NotionDatabaseItemPropertyAsRichText
  'Pour candidater': NotionDatabaseItemPropertyAsRichText
  'Pour en savoir plus': NotionDatabaseItemPropertyAsRichText
  'Processus de recrutement': NotionDatabaseItemPropertyAsRichText
  Rémunération: NotionDatabaseItemPropertyAsRichText
  'Si vous avez des questions': NotionDatabaseItemPropertyAsRichText
  'Votre profil': NotionDatabaseItemPropertyAsRichText
  redaction_status: NotionDatabaseItemPropertyAsSelect
  Équipe: NotionDatabaseItemPropertyAsRichText
}>
