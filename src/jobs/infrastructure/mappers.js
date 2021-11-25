const { startOfDay } = require('date-fns')
const { subDays } = require('date-fns')
const { toDate } = require('date-fns-tz')
const MarkdownIt = require('markdown-it')

const parseProperty = require('../../helpers/parseProperty')
const { Job, Ministry } = require('../entities')

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

const mapToJob = rawJob => {
  const title = parseProperty(rawJob.properties.Name)
  const { id } = rawJob
  const md = new MarkdownIt({ linkify: true })
  console.log(rawJob)

  return new Job({
    advantages: md.renderInline(parseProperty(rawJob.properties['Les plus du poste'])),
    conditions: parseProperty(rawJob.properties['Conditions particulières du poste'])
      .split('- ')
      .filter(item => item),
    contact: md.renderInline(parseProperty(rawJob.properties.Contact) || ''),
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

const mapToMinistry = rawMinistry => {
  const title = parseProperty(rawMinistry.properties.Titre)
  const { id } = rawMinistry
  const md = new MarkdownIt()

  return new Ministry({
    adress: parseProperty(rawMinistry.properties.Adresse),
    adressBis: parseProperty(rawMinistry.properties['Adresse bis']),
    brandBlock: parseProperty(rawMinistry.properties['Bloc marque']),
    challenges: md.render(parseProperty(rawMinistry.properties['Nos enjeux'])),
    fullName: parseProperty(rawMinistry.properties['Nom complet']),
    hiringProcess: md.render(parseProperty(rawMinistry.properties['Processus de recrutement'])),
    id,
    jobsLink: parseProperty(rawMinistry.properties['Toutes les offres disponibles']),
    joinTeam: md.render(parseProperty(rawMinistry.properties['Nous rejoindre - Pourquoi?'])),
    joinTeamMedia: parseProperty(rawMinistry.properties['Nous rejoindre - Infos']),
    keyNumbers: md.render(parseProperty(rawMinistry.properties['Les chiffres clés'])),
    keyNumbersMedia: parseProperty(rawMinistry.properties['Les chiffres clés - liens']),
    missions: md.render(parseProperty(rawMinistry.properties['Les missions'])),
    motivation: md.render(parseProperty(rawMinistry.properties["Raison d'être"])),
    motivationMedia: parseProperty(rawMinistry.properties["Raison d'être complément"]),
    organization: md.render(parseProperty(rawMinistry.properties['Notre organisation'])),
    organizationMedia: parseProperty(rawMinistry.properties['Notre organisation compléments']),
    profile: md.render(parseProperty(rawMinistry.properties['Ton profil'])),
    projects: md.render(parseProperty(rawMinistry.properties['Les projets ou rélisations'])),
    projectsMedia: parseProperty(rawMinistry.properties['Projets ou réalisations compléments']),
    publicationDate: toDate('2021-09-13T00:00:00+02:00', { timeZone: 'Europe/Paris' }),
    schedule: md.render(parseProperty(rawMinistry.properties.Agenda)),
    slug: buildSlug(title, id),
    socialNetworks: parseProperty(rawMinistry.properties['Réseaux sociaux']),
    testimonials: md.render(parseProperty(rawMinistry.properties['Nos agents en parlent'])),
    testimonialsMedia: parseProperty(rawMinistry.properties['Liens Nos agents en parlent']),
    thumbnail: parseProperty(rawMinistry.properties['Vignette temporaire']),
    title,
    values: md.render(parseProperty(rawMinistry.properties.Valeurs)),
    valuesMedia: parseProperty(rawMinistry.properties['Valeurs complément']),
    visualBanner: parseProperty(rawMinistry.properties['Bandeau visuel']),
    websites: parseProperty(rawMinistry.properties['Site(s) institutionel(s)']),
  })
}

const formatDetailFromPep = job => {
  const item = job.properties
  const title = parseProperty(item.Name)
  const { id } = job

  return new Job({
    advantages: '',
    conditions: [],
    contact: parseProperty(item.Origin_CustomFieldsTranslation_ShortText2_),
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

module.exports = {
  formatDetailFromPep,
  mapToJob,
  mapToMinistry,
}
