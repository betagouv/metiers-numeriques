import Job from '../models/Job'
import { NotionPepJob } from '../types/NotionPepJob'
import capitalize from './capitalize'
import convertMarkdownToHtml from './convertMarkdownToHtml'
import convertNotionNodeToPrismaValue from './convertNotionNodeToPrismaValue'
import convertNotionNodeToString from './convertNotionNodeToString'
import convertNotionNodeToStrings from './convertNotionNodeToStrings'
import handleError from './handleError'
import normalizePepDate from './normalizePepDate'
import slugify from './slugify'

export default function generateJobFromNotionPepJob(notionPepJob: NotionPepJob) {
  try {
    const { id } = notionPepJob
    const title = convertNotionNodeToString(notionPepJob.properties.Name) || '⚠️ {Name} manquant'

    const offerReference = convertNotionNodeToString(notionPepJob.properties.Offer_Reference_)
    const pepUrl = `https://place-emploi-public.gouv.fr/offre-emploi/${offerReference}/`
    const more = convertMarkdownToHtml(`[${pepUrl}](${pepUrl})`)
    const publicationDate =
      notionPepJob.properties.FirstPublicationDate.rich_text.length > 0
        ? normalizePepDate(notionPepJob.properties.FirstPublicationDate.rich_text[0].plain_text)
        : null

    return new Job({
      advantages: null,
      conditions: null,
      createdAt: convertNotionNodeToPrismaValue(notionPepJob.properties.CreeLe),
      department: convertNotionNodeToStrings(notionPepJob.properties.Origin_Entity_),
      entity: null,
      experiences: convertNotionNodeToStrings(notionPepJob.properties.ApplicantCriteria_EducationLevel_),
      hiringProcess: null,
      id,
      legacyServiceId: null,
      limitDate: null,
      locations: convertNotionNodeToStrings(notionPepJob.properties.Location_JobLocation_),
      mission: convertNotionNodeToPrismaValue(notionPepJob.properties.JobDescriptionTranslation_Description1_),
      more,
      openedToContractTypes: convertNotionNodeToStrings(notionPepJob.properties.JobDescription_Contract_),
      profile: convertNotionNodeToPrismaValue(notionPepJob.properties.JobDescriptionTranslation_Description2_),
      publicationDate,
      reference: `PEP-${id}`,
      salary: null,
      slug: slugify(title, id),
      tasks: null,
      team: null,
      teamInfo: null,
      title: capitalize(title),
      toApply: convertNotionNodeToPrismaValue(notionPepJob.properties.Origin_CustomFieldsTranslation_ShortText1_),
      updatedAt: convertNotionNodeToPrismaValue(notionPepJob.properties.MisAJourLe),
    })
  } catch (err) {
    handleError(err, 'helpers/generateJobFromNotionPepJob()')
  }
}
