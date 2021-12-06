import {
  NotionDatabaseItem,
  NotionPropertyAsCreatedTime,
  NotionPropertyAsDate,
  NotionPropertyAsLastEditedTime,
  NotionPropertyAsMultiSelect,
  NotionPropertyAsRelation,
  NotionPropertyAsRichText,
  NotionPropertyAsSelect,
  NotionPropertyAsTitle,
} from './Notion'

export type NotionJob = NotionDatabaseItem<{
  'Ce que vous ferez': NotionPropertyAsRichText
  'Conditions particulières du poste': NotionPropertyAsRichText
  Contact: NotionPropertyAsRichText
  /** Automatically filled by Notion */
  CreeLe: NotionPropertyAsCreatedTime
  'Date de saisie': NotionPropertyAsDate
  'Date limite': NotionPropertyAsDate
  'Entité recruteuse': NotionPropertyAsSelect
  Expérience: NotionPropertyAsMultiSelect
  'Les plus du poste': NotionPropertyAsRichText
  Localisation: NotionPropertyAsMultiSelect
  Ministère: NotionPropertyAsMultiSelect
  /** Automatically filled by Notion */
  MisAJourLe: NotionPropertyAsLastEditedTime
  Mission: NotionPropertyAsRichText
  Name: NotionPropertyAsTitle
  'Poste ouvert aux': NotionPropertyAsMultiSelect
  'Poste à pourvoir': NotionPropertyAsRichText
  'Pour candidater': NotionPropertyAsRichText
  'Pour en savoir plus': NotionPropertyAsRichText
  'Processus de recrutement': NotionPropertyAsRichText
  Rémunération: NotionPropertyAsRichText
  Service: NotionPropertyAsRelation
  'Si vous avez des questions': NotionPropertyAsRichText
  'Votre profil': NotionPropertyAsRichText
  redaction_status: NotionPropertyAsSelect
  Équipe: NotionPropertyAsRichText
}>
