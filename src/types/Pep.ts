import { Url } from 'url'

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
export type PepJob = {
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

export type PepJobNormalized = {
  ApplicantCriteria_Country_: string
  ApplicantCriteria_EducationLevel_: string
  ApplicantCriteria_ExperienceLevel_: string
  Author: string
  FirstPublicationDate: string
  FirstPublicationDateFormated: Date
  JobDescriptionTranslation_ContractLength_: string
  JobDescriptionTranslation_Description1_: string
  JobDescriptionTranslation_Description2_: string
  JobDescriptionTranslation_JobTitle_: string
  JobDescription_Contract_: string
  JobDescription_Country_: string
  JobDescription_CustomFieldsTranslation_LongText1_: string
  JobDescription_CustomFieldsTranslation_LongText2_: string
  JobDescription_CustomFieldsTranslation_LongText3_: string
  JobDescription_CustomFieldsTranslation_ShortText2_: string
  JobDescription_CustomFields_CustomCodeTableValue1_: string
  JobDescription_PrimaryProfile_: string
  JobDescription_ProfessionalCategory_: string
  JobDescription_SalaryRange_: string
  Link: Url
  Location_Country_Country_: string
  Location_CustomFieldsTranslation_ShortText1_: string
  Location_Department_Department_: string
  Location_GeographicalArea_GeographicalArea_: string
  Location_JobLocation_: string
  Location_Region_Region_: string
  MainSupervisor: string
  Name?: string
  OF_CustomFields_Date1_: string
  OF_CustomFields_Date1_Formated: Date
  OfferCustomBlock1_CustomFieldsTranslation_LongText1_: string
  OfferCustomBlock1_CustomFields_CustomCodeTableValue3_: string
  OfferID: string
  Offer_BackOfficeUser_User_: string
  Offer_CoordLat_: string
  Offer_CoordLong_: string
  Offer_CreationUser_: string
  Offer_CustomFieldsTranslation_LongText1_: string
  Offer_CustomFieldsTranslation_LongText2_: string
  Offer_ModificationDate_: string
  Offer_ModificationDate_Formated: Date
  Offer_OfferStatus_: string
  Offer_Reference_: string
  Offer_Specialisation_Specialisation_: string
  Origin_BeginningDate_: string
  Origin_BeginningDate_Formated: Date
  Origin_CustomFieldsTranslation_ShortText1_: string
  Origin_CustomFieldsTranslation_ShortText2_: string
  Origin_CustomFieldsTranslation_ShortText3_: string
  Origin_Entity_: string
  Origin_Entity_With1: string
  Origin_Entity_With2: string
  Origin_Entity_With3: string
  Origin_Entity_With4: string
  Origin_Entity_With5: string
  Property: string
  RequiredLanguage_LanguageLevel_: string
  SchedulingData_AutomaticUpdate_: string
  SchedulingData_DefaultPublicationBeginDate_: string
  SchedulingData_DefaultPublicationBeginDate_Formated: Date
  SchedulingData_DefaultPublicationEndDate_: string
  SchedulingData_DefaultPublicationEndDate_Formated: Date
  SchedulingData_UpdateFrequency_: string
  Titre: string
  hide: boolean
  publicationDate: Date
}
