import Job from '../models/Job'
import { NotionSkbJob } from '../types/NotionSkbJob'
import capitalize from './capitalize'
import convertNotionNodeToHtml from './convertNotionNodeToHtml'
import convertNotionNodeToString from './convertNotionNodeToString'
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
      advantages: undefined,
      conditions: undefined,
      createdAt: notionSkbJob.properties.CreeLe.created_time,
      department: convertNotionNodeToStrings(notionSkbJob.properties.Entreprise),
      id,
      limitDate: undefined,
      locations: convertNotionNodeToStrings(notionSkbJob.properties.Localisation),
      mission: convertNotionNodeToHtml(notionSkbJob.properties.Description),
      reference: `SKB-${id}`,
      slug: slugify(title, id),
      title: capitalize(title),
      updatedAt: notionSkbJob.properties.MisAJourLe.last_edited_time,
      updatedDate: convertNotionNodeToString(notionSkbJob.properties.MisAJourLe),
    })
  } catch (err) {
    handleError(err, 'helpers/generateJobFromNotionSkbJob()')
  }
}
