import {
  NotionDatabaseItem,
  NotionPropertyAsDate,
  NotionPropertyAsFiles,
  NotionPropertyAsRichText,
  NotionPropertyAsSelect,
  NotionPropertyAsPeople,
  NotionPropertyAsTitle,
} from './Notion'

export type NotionInstitution = NotionDatabaseItem<{
  Adresse: NotionPropertyAsRichText
  'Adresse bis': NotionPropertyAsFiles
  Agenda: NotionPropertyAsRichText
  Assign: NotionPropertyAsPeople
  Banniere: NotionPropertyAsFiles
  'Bloc marque': NotionPropertyAsFiles
  Date: NotionPropertyAsDate
  'Les chiffres clés': NotionPropertyAsRichText
  'Les chiffres clés - liens': NotionPropertyAsFiles
  'Les projets ou rélisations': NotionPropertyAsRichText
  'Liens Nos agents en parlent': NotionPropertyAsFiles
  'Nom complet': NotionPropertyAsRichText
  'Nos agents en parlent': NotionPropertyAsRichText
  'Nos enjeux': NotionPropertyAsRichText
  'Nos missions': NotionPropertyAsRichText
  'Notre organisation': NotionPropertyAsRichText
  'Notre organisation compléments': NotionPropertyAsFiles
  'Nous rejoindre - Infos': NotionPropertyAsFiles
  'Nous rejoindre - Pourquoi?': NotionPropertyAsRichText
  'Processus de recrutement': NotionPropertyAsRichText
  'Projets ou réalisations compléments': NotionPropertyAsFiles
  'Projets visuels': NotionPropertyAsFiles
  "Raison d'être": NotionPropertyAsRichText
  "Raison d'être complément": NotionPropertyAsFiles
  'Réseaux sociaux': NotionPropertyAsFiles
  'Site(s) institutionel(s)': NotionPropertyAsFiles
  Status: NotionPropertyAsSelect
  Titre: NotionPropertyAsTitle
  'Ton profil': NotionPropertyAsRichText
  'Toutes les offres disponibles': NotionPropertyAsFiles
  Valeurs: NotionPropertyAsRichText
  'Valeurs complément': NotionPropertyAsFiles
  Vignette: NotionPropertyAsFiles
  'Vignette temporaire': NotionPropertyAsFiles
}>
