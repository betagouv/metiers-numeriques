import {
  NotionDatabaseItem,
  NotionPropertyAsCreatedTime,
  NotionPropertyAsDate,
  NotionPropertyAsCheckbox,
  NotionPropertyAsEmail,
  NotionPropertyAsLastEditedTime,
  NotionPropertyAsNumber,
  NotionPropertyAsRichText,
  NotionPropertyAsTitle,
} from './Notion'

export type NotionSkbJob = NotionDatabaseItem<{
  /** Automatically filled by Notion */
  CreeLe: NotionPropertyAsCreatedTime
  DateDeDebut: NotionPropertyAsDate
  DegreDeMobilite: NotionPropertyAsRichText
  Description: NotionPropertyAsRichText
  Email: NotionPropertyAsEmail
  Entreprise: NotionPropertyAsRichText
  EstPublie: NotionPropertyAsCheckbox
  /** Internally generated ID */
  ID: NotionPropertyAsRichText
  Localisation: NotionPropertyAsRichText
  /** Automatically filled by Notion */
  MisAJourLe: NotionPropertyAsLastEditedTime
  Nom: NotionPropertyAsRichText
  NombreDeCandidatures: NotionPropertyAsNumber
  NombreDeCreneauxDisponibles: NotionPropertyAsNumber
  Prenom: NotionPropertyAsRichText
  SituationProfessionnelle: NotionPropertyAsRichText
  Titre: NotionPropertyAsTitle
}>
