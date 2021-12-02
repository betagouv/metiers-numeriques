import {
  NotionDatabaseItem,
  NotionDatabaseItemPropertyAsCheckbox,
  NotionDatabaseItemPropertyAsCreatedTime,
  NotionDatabaseItemPropertyAsDate,
  NotionDatabaseItemPropertyAsLastEditedTime,
  NotionDatabaseItemPropertyAsRichText,
  NotionDatabaseItemPropertyAsTitle,
  NotionDatabaseItemPropertyAsUrl,
} from './Notion'

export type NotionPepJob = NotionDatabaseItem<{
  ApplicantCriteria_Country_: NotionDatabaseItemPropertyAsRichText
  ApplicantCriteria_EducationLevel_: NotionDatabaseItemPropertyAsRichText
  ApplicantCriteria_ExperienceLevel_: NotionDatabaseItemPropertyAsRichText
  Author: NotionDatabaseItemPropertyAsRichText
  Created: NotionDatabaseItemPropertyAsCreatedTime
  /** Automatically filled by Notion */
  CreeLe: NotionDatabaseItemPropertyAsCreatedTime
  FirstPublicationDate: NotionDatabaseItemPropertyAsRichText
  FirstPublicationDateFormated: NotionDatabaseItemPropertyAsDate
  JobDescriptionTranslation_ContractLength_: NotionDatabaseItemPropertyAsRichText
  JobDescriptionTranslation_Description1_: NotionDatabaseItemPropertyAsRichText
  JobDescriptionTranslation_Description2_: NotionDatabaseItemPropertyAsRichText
  JobDescriptionTranslation_JobTitle_: NotionDatabaseItemPropertyAsRichText
  JobDescription_Contract_: NotionDatabaseItemPropertyAsRichText
  JobDescription_Country_: NotionDatabaseItemPropertyAsRichText
  JobDescription_CustomFieldsTranslation_LongText1_: NotionDatabaseItemPropertyAsRichText
  JobDescription_CustomFieldsTranslation_LongText2_: NotionDatabaseItemPropertyAsRichText
  JobDescription_CustomFieldsTranslation_LongText3_: NotionDatabaseItemPropertyAsRichText
  JobDescription_CustomFieldsTranslation_ShortText2_: NotionDatabaseItemPropertyAsRichText
  JobDescription_CustomFields_CustomCodeTableValue1_: NotionDatabaseItemPropertyAsRichText
  JobDescription_PrimaryProfile_: NotionDatabaseItemPropertyAsRichText
  JobDescription_ProfessionalCategory_: NotionDatabaseItemPropertyAsRichText
  JobDescription_SalaryRange_: NotionDatabaseItemPropertyAsRichText
  Link: NotionDatabaseItemPropertyAsUrl
  Location_Country_Country_: NotionDatabaseItemPropertyAsRichText
  Location_CustomFieldsTranslation_ShortText1_: NotionDatabaseItemPropertyAsRichText
  Location_Department_Department_: NotionDatabaseItemPropertyAsRichText
  Location_GeographicalArea_GeographicalArea_: NotionDatabaseItemPropertyAsRichText
  Location_JobLocation_: NotionDatabaseItemPropertyAsRichText
  Location_Region_Region_: NotionDatabaseItemPropertyAsRichText
  MainSupervisor: NotionDatabaseItemPropertyAsRichText
  /** Automatically filled by Notion */
  MisAJourLe: NotionDatabaseItemPropertyAsLastEditedTime
  Name: NotionDatabaseItemPropertyAsTitle
  OF_CustomFields_Date1_: NotionDatabaseItemPropertyAsRichText
  OF_CustomFields_Date1_Formated: NotionDatabaseItemPropertyAsDate
  OfferCustomBlock1_CustomFieldsTranslation_LongText1_: NotionDatabaseItemPropertyAsRichText
  OfferCustomBlock1_CustomFields_CustomCodeTableValue3_: NotionDatabaseItemPropertyAsRichText
  OfferID: NotionDatabaseItemPropertyAsRichText
  Offer_BackOfficeUser_User_: NotionDatabaseItemPropertyAsRichText
  Offer_CoordLat_: NotionDatabaseItemPropertyAsRichText
  Offer_CoordLong_: NotionDatabaseItemPropertyAsRichText
  Offer_CreationUser_: NotionDatabaseItemPropertyAsRichText
  Offer_CustomFieldsTranslation_LongText1_: NotionDatabaseItemPropertyAsRichText
  Offer_CustomFieldsTranslation_LongText2_: NotionDatabaseItemPropertyAsRichText
  Offer_ModificationDate_: NotionDatabaseItemPropertyAsRichText
  Offer_ModificationDate_Formated: NotionDatabaseItemPropertyAsDate
  Offer_OfferStatus_: NotionDatabaseItemPropertyAsRichText
  Offer_Reference_: NotionDatabaseItemPropertyAsRichText
  Offer_Specialisation_Specialisation_: NotionDatabaseItemPropertyAsRichText
  Origin_BeginningDate_: NotionDatabaseItemPropertyAsRichText
  Origin_BeginningDate_Formated: NotionDatabaseItemPropertyAsDate
  Origin_CustomFieldsTranslation_ShortText1_: NotionDatabaseItemPropertyAsRichText
  Origin_CustomFieldsTranslation_ShortText2_: NotionDatabaseItemPropertyAsRichText
  Origin_CustomFieldsTranslation_ShortText3_: NotionDatabaseItemPropertyAsRichText
  Origin_Entity_: NotionDatabaseItemPropertyAsRichText
  Origin_Entity_With1: NotionDatabaseItemPropertyAsRichText
  Origin_Entity_With2: NotionDatabaseItemPropertyAsRichText
  Origin_Entity_With3: NotionDatabaseItemPropertyAsRichText
  Origin_Entity_With4: NotionDatabaseItemPropertyAsRichText
  Origin_Entity_With5: NotionDatabaseItemPropertyAsRichText
  Property: NotionDatabaseItemPropertyAsRichText
  RequiredLanguage_LanguageLevel_: NotionDatabaseItemPropertyAsRichText
  SchedulingData_AutomaticUpdate_: NotionDatabaseItemPropertyAsRichText
  SchedulingData_DefaultPublicationBeginDate_: NotionDatabaseItemPropertyAsRichText
  SchedulingData_DefaultPublicationBeginDate_Formated: NotionDatabaseItemPropertyAsDate
  SchedulingData_DefaultPublicationEndDate_: NotionDatabaseItemPropertyAsRichText
  SchedulingData_DefaultPublicationEndDate_Formated: NotionDatabaseItemPropertyAsDate
  SchedulingData_UpdateFrequency_: NotionDatabaseItemPropertyAsRichText
  hide: NotionDatabaseItemPropertyAsCheckbox
  publicationDate: NotionDatabaseItemPropertyAsDate
}>
