import Job from '../models/Job'
import { NotionSkbJob } from '../types/NotionSkbJob'
import capitalize from './capitalize'
import convertNotionNodeToHtml from './convertNotionNodeToHtml'
import convertNotionNodeToStrings from './convertNotionNodeToStrings'
import handleError from './handleError'
import slugify from './slugify'

export default function generateJobFromNotionSkbJob(notionSkbJob: NotionSkbJob) {
  try {
    const { id } = notionSkbJob
    const title = convertNotionNodeToHtml(notionSkbJob.properties.Titre, true)
    if (title === undefined) {
      throw new Error(`Notion Seekube job #${id} has an undefined title.`)
    }

    return new Job({
      $createdAt: notionSkbJob.properties.CreeLe.created_time,
      $reference: `SKB-${id}`,
      $updatedAt: notionSkbJob.properties.MisAJourLe.last_edited_time,

      advantages: undefined,
      conditions: undefined,
      department: convertNotionNodeToStrings(notionSkbJob.properties.Entreprise),
      id,
      limitDate: undefined,
      locations: convertNotionNodeToStrings(notionSkbJob.properties.Localisation),
      mission: convertNotionNodeToHtml(notionSkbJob.properties.Description),
      slug: slugify(title, id),
      title: capitalize(title),
    })
  } catch (err) {
    handleError(err, 'helpers/generateJobFromNotionSkbJob()')
  }
}
