import {
  NotionDatabaseItem,
  NotionDatabaseItemPropertyAsDate,
  NotionDatabaseItemPropertyAsFiles,
  NotionDatabaseItemPropertyAsRichText,
  NotionDatabaseItemPropertyAsSelect,
  NotionDatabaseItemPropertyAsPeople,
  NotionDatabaseItemPropertyAsTitle,
} from './Notion'

export type NotionInstitution = NotionDatabaseItem<{
  Adresse: NotionDatabaseItemPropertyAsRichText
  'Adresse bis': NotionDatabaseItemPropertyAsFiles
  Agenda: NotionDatabaseItemPropertyAsRichText
  Assign: NotionDatabaseItemPropertyAsPeople
  Banniere: NotionDatabaseItemPropertyAsFiles
  'Bloc marque': NotionDatabaseItemPropertyAsFiles
  Date: NotionDatabaseItemPropertyAsDate
  'Les chiffres clés': NotionDatabaseItemPropertyAsRichText
  'Les chiffres clés - liens': NotionDatabaseItemPropertyAsFiles
  'Les projets ou rélisations': NotionDatabaseItemPropertyAsRichText
  'Liens Nos agents en parlent': NotionDatabaseItemPropertyAsFiles
  'Nom complet': NotionDatabaseItemPropertyAsRichText
  'Nos agents en parlent': NotionDatabaseItemPropertyAsRichText
  'Nos enjeux': NotionDatabaseItemPropertyAsRichText
  'Nos missions': NotionDatabaseItemPropertyAsRichText
  'Notre organisation': NotionDatabaseItemPropertyAsRichText
  'Notre organisation compléments': NotionDatabaseItemPropertyAsFiles
  'Nous rejoindre - Infos': NotionDatabaseItemPropertyAsFiles
  'Nous rejoindre - Pourquoi?': NotionDatabaseItemPropertyAsRichText
  'Processus de recrutement': NotionDatabaseItemPropertyAsRichText
  'Projets ou réalisations compléments': NotionDatabaseItemPropertyAsFiles
  'Projets visuels': NotionDatabaseItemPropertyAsFiles
  "Raison d'être": NotionDatabaseItemPropertyAsRichText
  "Raison d'être complément": NotionDatabaseItemPropertyAsFiles
  'Réseaux sociaux': NotionDatabaseItemPropertyAsFiles
  'Site(s) institutionel(s)': NotionDatabaseItemPropertyAsFiles
  Status: NotionDatabaseItemPropertyAsSelect
  Titre: NotionDatabaseItemPropertyAsTitle
  'Ton profil': NotionDatabaseItemPropertyAsRichText
  'Toutes les offres disponibles': NotionDatabaseItemPropertyAsFiles
  Valeurs: NotionDatabaseItemPropertyAsRichText
  'Valeurs complément': NotionDatabaseItemPropertyAsFiles
  Vignette: NotionDatabaseItemPropertyAsFiles
  'Vignette temporaire': NotionDatabaseItemPropertyAsFiles
}>
