import {
  NotionDatabaseItem,
  NotionDatabaseItemPropertyAsCreatedTime,
  NotionDatabaseItemPropertyAsDate,
  NotionDatabaseItemPropertyAsCheckbox,
  NotionDatabaseItemPropertyAsEmail,
  NotionDatabaseItemPropertyAsLastEditedTime,
  NotionDatabaseItemPropertyAsNumber,
  NotionDatabaseItemPropertyAsRichText,
  NotionDatabaseItemPropertyAsTitle,
} from './Notion'

export type NotionSkbJob = NotionDatabaseItem<{
  /** Automatically filled by Notion */
  CreeLe: NotionDatabaseItemPropertyAsCreatedTime
  DateDeDebut: NotionDatabaseItemPropertyAsDate
  DegreDeMobilite: NotionDatabaseItemPropertyAsRichText
  Description: NotionDatabaseItemPropertyAsRichText
  Email: NotionDatabaseItemPropertyAsEmail
  Entreprise: NotionDatabaseItemPropertyAsRichText
  EstPublie: NotionDatabaseItemPropertyAsCheckbox
  /** Internally generated ID */
  ID: NotionDatabaseItemPropertyAsRichText
  Localisation: NotionDatabaseItemPropertyAsRichText
  /** Automatically filled by Notion */
  MisAJourLe: NotionDatabaseItemPropertyAsLastEditedTime
  Nom: NotionDatabaseItemPropertyAsRichText
  NombreDeCandidatures: NotionDatabaseItemPropertyAsNumber
  NombreDeCreneauxDisponibles: NotionDatabaseItemPropertyAsNumber
  Prenom: NotionDatabaseItemPropertyAsRichText
  SituationProfessionnelle: NotionDatabaseItemPropertyAsRichText
  Titre: NotionDatabaseItemPropertyAsTitle
}>
