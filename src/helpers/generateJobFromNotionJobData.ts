import Job from '../models/Job'
import convertMarkdownToHtml from './convertMarkdownToHtml'
import parseProperty from './parseProperty'
import slugify from './slugify'

export default function generateJobFromNotionJobData(notionJobData: any) {
  const title = parseProperty(notionJobData.properties.Name)
  const { id } = notionJobData

  return new Job({
    advantages: convertMarkdownToHtml(parseProperty(notionJobData.properties['Les plus du poste'])),
    conditions: parseProperty(notionJobData.properties['Conditions particulières du poste'])
      .split('- ')
      .filter(item => item),
    // contact: convertMarkdownToHtml(parseProperty(notionJobData.properties.Contact) || ''),
    department: parseProperty(notionJobData.properties['Ministère']).map(a => convertMarkdownToHtml(a)),
    entity: convertMarkdownToHtml(parseProperty(notionJobData.properties['Entité recruteuse']) || '') || null,
    experiences: parseProperty(notionJobData.properties['Expérience']),
    hiringProcess:
      convertMarkdownToHtml(parseProperty(notionJobData.properties['Processus de recrutement']) || '') || null,
    id: notionJobData.id,
    limitDate: parseProperty(notionJobData.properties['Date limite'])
      ? parseProperty(notionJobData.properties['Date limite'])
      : undefined,
    locations: parseProperty(notionJobData.properties.Localisation),
    mission: convertMarkdownToHtml(parseProperty(notionJobData.properties.Mission)),
    more: convertMarkdownToHtml(parseProperty(notionJobData.properties['Pour en savoir plus'])),
    openedToContractTypes: parseProperty(notionJobData.properties['Poste ouvert aux']),
    profile: parseProperty(notionJobData.properties['Votre profil'])
      .split('- ')
      .filter(item => item),
    publicationDate: parseProperty(notionJobData.properties['Date de saisie']),
    salary: parseProperty(notionJobData.properties['Rémunération']),
    slug: slugify(title, id),
    tasks: parseProperty(notionJobData.properties['Ce que vous ferez'])
      .split('- ')
      .filter(item => item),
    team: parseProperty(notionJobData.properties['Équipe']),
    teamInfo: convertMarkdownToHtml(parseProperty(notionJobData.properties['Si vous avez des questions'])),
    title,
    toApply: convertMarkdownToHtml(parseProperty(notionJobData.properties['Pour candidater'])),
  })
}
