import Ministry from '../models/Ministry'
import { NotionMinistry } from '../types/NotionMinistry'
import convertNotionNodeToHtml from './convertNotionNodeToHtml'
import convertNotionNodeToHtmls from './convertNotionNodeToHtmls'
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
      address: convertNotionNodeToHtml(notionMinistry.properties.Adresse),
      addressFiles: notionMinistry.properties['Adresse bis'].files,
      challenges: convertNotionNodeToHtml(notionMinistry.properties['Nos enjeux']),
      fullName: convertNotionNodeToString(notionMinistry.properties['Nom complet']),
      hiringProcess: convertNotionNodeToHtml(notionMinistry.properties['Processus de recrutement']),
      id,
      jobsLink: convertNotionNodeToStrings(notionMinistry.properties['Toutes les offres disponibles']),
      joinTeam: convertNotionNodeToHtml(notionMinistry.properties['Nous rejoindre - Pourquoi?']),
      joinTeamFiles: convertNotionNodeToHtmls(notionMinistry.properties['Nous rejoindre - Infos']),
      keyNumbers: convertNotionNodeToHtml(notionMinistry.properties['Les chiffres clés']),
      keyNumbersMedia: convertNotionNodeToStrings(notionMinistry.properties['Les chiffres clés - liens']),
      logoUrl: convertNotionNodeToString(notionMinistry.properties['Bloc marque']),
      missions: convertNotionNodeToHtml(notionMinistry.properties['Nos missions']),
      motivation: convertNotionNodeToHtml(notionMinistry.properties["Raison d'être"]),
      motivationFiles: convertNotionNodeToHtmls(notionMinistry.properties["Raison d'être complément"]),
      organization: convertNotionNodeToHtml(notionMinistry.properties['Notre organisation']),
      organizationFiles: convertNotionNodeToHtmls(notionMinistry.properties['Notre organisation compléments']),
      profile: convertNotionNodeToHtml(notionMinistry.properties['Ton profil']),
      projectFiles: convertNotionNodeToHtmls(notionMinistry.properties['Projets ou réalisations compléments']),
      projects: convertNotionNodeToHtml(notionMinistry.properties['Les projets ou rélisations']),
      schedule: convertNotionNodeToHtml(notionMinistry.properties.Agenda),
      slug: slugify(title, id),
      socialNetworkUrls: convertNotionNodeToStrings(notionMinistry.properties['Réseaux sociaux']),
      testimonials: convertNotionNodeToHtml(notionMinistry.properties['Nos agents en parlent']),
      testimonialsFiles: convertNotionNodeToHtmls(notionMinistry.properties['Liens Nos agents en parlent']),
      thumbnailUrl: convertNotionNodeToString(notionMinistry.properties['Vignette temporaire']),
      title,
      valueFiles: convertNotionNodeToHtmls(notionMinistry.properties['Valeurs complément']),
      values: convertNotionNodeToHtml(notionMinistry.properties.Valeurs),
      websiteFiles: notionMinistry.properties['Site(s) institutionel(s)'].files,
    })
  } catch (err) {
    handleError(err, 'helpers/generateJobFromNotionJob()')
  }
}
