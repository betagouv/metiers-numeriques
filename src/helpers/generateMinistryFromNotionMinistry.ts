import Ministry from '../models/Ministry'
import { NotionMinistry } from '../types/NotionMinistry'
import convertNotionNodeToHtml from './convertNotionNodeToHtml'
import convertNotionNodeToString from './convertNotionNodeToString'
import convertNotionNodeToStrings from './convertNotionNodeToStrings'
import handleError from './handleError'
import slugify from './slugify'

export default function generateMinistryFromNotionMinistry(notionMinistry: NotionMinistry) {
  try {
    const { id } = notionMinistry
    const title = convertNotionNodeToHtml(notionMinistry.properties.Titre, true)
    if (title === undefined) {
      throw new Error(`Notion ministry #${id} has an undefined title.`)
    }

    return new Ministry({
      adress: convertNotionNodeToHtml(notionMinistry.properties.Adresse),
      challenges: convertNotionNodeToHtml(notionMinistry.properties['Nos enjeux']),
      fullName: convertNotionNodeToString(notionMinistry.properties['Nom complet']),
      hiringProcess: convertNotionNodeToHtml(notionMinistry.properties['Processus de recrutement']),
      id,
      jobsLink: convertNotionNodeToStrings(notionMinistry.properties['Toutes les offres disponibles']),
      joinTeam: convertNotionNodeToHtml(notionMinistry.properties['Nous rejoindre - Pourquoi?']),
      joinTeamMedia: convertNotionNodeToStrings(notionMinistry.properties['Nous rejoindre - Infos']),
      keyNumbers: convertNotionNodeToHtml(notionMinistry.properties['Les chiffres clés']),
      keyNumbersMedia: convertNotionNodeToStrings(notionMinistry.properties['Les chiffres clés - liens']),
      logoUrl: convertNotionNodeToString(notionMinistry.properties['Bloc marque']),
      missions: convertNotionNodeToHtml(notionMinistry.properties['Nos missions']),
      motivation: convertNotionNodeToHtml(notionMinistry.properties["Raison d'être"]),
      motivationMedia: convertNotionNodeToStrings(notionMinistry.properties["Raison d'être complément"]),
      organization: convertNotionNodeToHtml(notionMinistry.properties['Notre organisation']),
      organizationMedia: convertNotionNodeToStrings(notionMinistry.properties['Notre organisation compléments']),
      otherAdresses: notionMinistry.properties['Adresse bis'].files,
      profile: convertNotionNodeToHtml(notionMinistry.properties['Ton profil']),
      projects: convertNotionNodeToHtml(notionMinistry.properties['Les projets ou rélisations']),
      projectsMedia: convertNotionNodeToStrings(notionMinistry.properties['Projets ou réalisations compléments']),
      schedule: convertNotionNodeToHtml(notionMinistry.properties.Agenda),
      slug: slugify(title, id),
      socialNetworks: convertNotionNodeToStrings(notionMinistry.properties['Réseaux sociaux']),
      testimonials: convertNotionNodeToHtml(notionMinistry.properties['Nos agents en parlent']),
      testimonialsMedia: convertNotionNodeToStrings(notionMinistry.properties['Liens Nos agents en parlent']),
      thumbnailUrl: convertNotionNodeToString(notionMinistry.properties['Vignette temporaire']),
      title,
      values: convertNotionNodeToHtml(notionMinistry.properties.Valeurs),
      valuesMedia: convertNotionNodeToStrings(notionMinistry.properties['Valeurs complément']),
      websites: convertNotionNodeToStrings(notionMinistry.properties['Site(s) institutionel(s)']),
    })
  } catch (err) {
    handleError(err, 'helpers/generateJobFromNotionJob()')
  }
}
