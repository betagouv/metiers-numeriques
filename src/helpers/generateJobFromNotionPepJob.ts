import Job from '../models/Job'
import { NotionPepJob } from '../types/NotionPepJob'
import capitalize from './capitalize'
import convertMarkdownToHtml from './convertMarkdownToHtml'
import convertNotionNodeToHtml from './convertNotionNodeToHtml'
import convertNotionNodeToStrings from './convertNotionNodeToStrings'
import handleError from './handleError'
import humanizePepDate from './humanizePepDate'
import slugify from './slugify'

export default function generateJobFromNotionPepJob(notionPepJob: NotionPepJob) {
  try {
    const { id } = notionPepJob
    const title = convertNotionNodeToHtml(notionPepJob.properties.Name, true)
    if (title === undefined) {
      throw new Error(`Notion PEP job #${id} has an undefined title.`)
    }

    const offerReference = convertNotionNodeToHtml(notionPepJob.properties.Offer_Reference_, true)
    const pepUrl = `https://place-emploi-public.gouv.fr/offre-emploi/${offerReference}/`
    const more = convertMarkdownToHtml(`[${pepUrl}](${pepUrl})`)
    const publicationDate =
      notionPepJob.properties.FirstPublicationDate.rich_text.length > 0
        ? humanizePepDate(notionPepJob.properties.FirstPublicationDate.rich_text[0].plain_text)
        : undefined

    return new Job({
      $createdAt: notionPepJob.properties.CreeLe.created_time,
      $reference: `PEP-${id}`,
      $updatedAt: notionPepJob.properties.MisAJourLe.last_edited_time,

      advantages: undefined,
      conditions: undefined,
      department: convertNotionNodeToStrings(notionPepJob.properties.Origin_Entity_),
      experiences: convertNotionNodeToStrings(notionPepJob.properties.ApplicantCriteria_EducationLevel_),
      id,
      limitDate: undefined,
      locations: convertNotionNodeToStrings(notionPepJob.properties.Location_JobLocation_),
      mission: convertNotionNodeToHtml(notionPepJob.properties.JobDescriptionTranslation_Description1_),
      more,
      openedToContractTypes: convertNotionNodeToStrings(notionPepJob.properties.JobDescription_Contract_),
      profile: convertNotionNodeToHtml(notionPepJob.properties.JobDescriptionTranslation_Description2_),
      publicationDate,
      salary: undefined,
      slug: slugify(title, id),
      tasks: undefined,
      team: undefined,
      teamInfo: undefined,
      title: capitalize(title),
      toApply: convertNotionNodeToHtml(notionPepJob.properties.Origin_CustomFieldsTranslation_ShortText1_),
    })
  } catch (err) {
    handleError(err, 'helpers/generateJobFromNotionPepJob()')
  }
}
