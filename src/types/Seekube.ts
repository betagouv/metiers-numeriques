/**
 * @example
 * ```json
 * {
 *   "Titre": "SICCRF - Développeur fullstack ASP .net",
 *   "Entreprise": "Ministère de l'Économie, des Finances et de la Relance - DGCCRF",
 *   "Prénom": "Jacinta",
 *   "Nom": "CARVALHO",
 *   "Mail": "jacinta.carvalho@dgccrf.finances.gouv.fr",
 *   "Statut": "published",
 *   "#Candidatures": 8,
 *   "Localisation": "Auvergne-Rhône-Alpes, France, Île-de-France, France, Occitanie, France",
 *   "Nb créneaux disponibes": 0,
 *   "Description": "Service à Compétence Nationale, le SICCRF est le service informatique de la DGCCRF...",
 *   "Situation professionnelle ": "",
 *   "Degré de mobilité": "Auvergne-Rhône-Alpes, Île-de-France, Occitanie",
 *   "Date de début - recruteur": "2021-12"
 * }
 * ```
 */
export type SeekubeJob = {
  '#Candidatures': number
  /** Can either be "YYYY-MM" or "" */
  'Date de début - recruteur': string
  'Degré de mobilité': string
  Description: string
  Entreprise: string
  Localisation: string
  Mail: string
  'Nb créneaux disponibes': number
  Nom: string
  Prénom: string
  'Situation professionnelle ': string
  Statut: string
  Titre: string
}

export type SeekubeJobNormalized = {
  DateDeDebut: Date
  DegreDeMobilite: string
  Description: string
  Email: string
  Entreprise: string
  EstPublie: boolean
  /** Internally generated ID */
  ID: string
  Localisation: string
  Nom: string
  NombreDeCandidatures: number
  NombreDeCreneauxDisponibles: number
  Prenom: string
  SituationProfessionnelle: string
  Titre: string
}
