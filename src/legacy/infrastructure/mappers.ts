import { startOfDay, subDays } from 'date-fns'
import MarkdownIt from 'markdown-it'

import parseProperty from '../../helpers/parseProperty'
import Job from '../../models/Job'

function urlify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g

  return text.replace(urlRegex, url => `<a href="${url}">${url}</a>`)
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

const twoDaysAgo = subDays(startOfDay(new Date()), 2)

const buildSlug = (title, id) => {
  const slug = `${title}-${id}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')

  return slug
}

export const mapToJob = rawJob => {
  const title = parseProperty(rawJob.properties.Name)
  const { id } = rawJob
  const md = new MarkdownIt({ linkify: true })

  return new Job({
    advantages: md.renderInline(parseProperty(rawJob.properties['Les plus du poste'])),
    conditions: parseProperty(rawJob.properties['Conditions particulières du poste'])
      .split('- ')
      .filter(item => item),
    // contact: md.renderInline(parseProperty(rawJob.properties.Contact) || ''),
    department: parseProperty(rawJob.properties['Ministère']).map(a => md.renderInline(a)),
    entity: md.renderInline(parseProperty(rawJob.properties['Entité recruteuse']) || '') || null,
    experiences: parseProperty(rawJob.properties['Expérience']),
    hiringProcess: md.renderInline(parseProperty(rawJob.properties['Processus de recrutement']) || '') || null,
    id: rawJob.id,
    limitDate: parseProperty(rawJob.properties['Date limite'])
      ? parseProperty(rawJob.properties['Date limite'])
      : undefined,
    locations: parseProperty(rawJob.properties.Localisation),
    mission: md.renderInline(parseProperty(rawJob.properties.Mission)),
    more: md.renderInline(parseProperty(rawJob.properties['Pour en savoir plus'])),
    openedToContractTypes: parseProperty(rawJob.properties['Poste ouvert aux']),
    profile: parseProperty(rawJob.properties['Votre profil'])
      .split('- ')
      .filter(item => item),
    publicationDate: parseProperty(rawJob.properties['Date de saisie'])
      ? parseProperty(rawJob.properties['Date de saisie'])
      : twoDaysAgo,
    salary: parseProperty(rawJob.properties['Rémunération']),
    slug: buildSlug(title, id),
    tasks: parseProperty(rawJob.properties['Ce que vous ferez'])
      .split('- ')
      .filter(item => item),
    team: parseProperty(rawJob.properties['Équipe']),
    teamInfo: md.renderInline(parseProperty(rawJob.properties['Si vous avez des questions'])),
    title,
    toApply: md.renderInline(parseProperty(rawJob.properties['Pour candidater'])),
  })
}

export const formatDetailFromPep = job => {
  const item = job.properties
  const title = parseProperty(item.Name)
  const { id } = job

  return new Job({
    advantages: '',
    conditions: [],
    // contact: parseProperty(item.Origin_CustomFieldsTranslation_ShortText2_),
    department: [parseProperty(item.Origin_Entity_)],
    experiences: parseProperty(item.ApplicantCriteria_EducationLevel_)
      ? [parseProperty(item.ApplicantCriteria_EducationLevel_)]
      : [],
    id,
    limitDate: '',
    locations: [(parseProperty(item.Location_JobLocation_) || '').replace('- -', '')],
    mission: urlify(parseProperty(item.JobDescriptionTranslation_Description1_) || ''),
    more: urlify(`https://place-emploi-public.gouv.fr/offre-emploi/${parseProperty(item.Offer_Reference_)}/`),
    openedToContractTypes: parseProperty(item.JobDescription_Contract_)
      ? [parseProperty(item.JobDescription_Contract_)]
      : [],
    profile: [parseProperty(item.JobDescriptionTranslation_Description2_)],
    publicationDate: (parseProperty(item.FirstPublicationDate) || '').split(' ')[0],
    salary: undefined,
    slug: `${buildSlug(title, id)}?tag=pep`,
    tasks: undefined,
    team: '',
    teamInfo: '',
    title,
    toApply: parseProperty(item.Origin_CustomFieldsTranslation_ShortText1_),
  })
}