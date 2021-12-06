import Institution from '../models/Institution'
import { NotionInstitution } from '../types/NotionInstitution'
import convertNotionNodeToBoolean from './convertNotionNodeToBoolean'
import convertNotionNodeToHtml from './convertNotionNodeToHtml'
import convertNotionNodeToHtmls from './convertNotionNodeToHtmls'
import convertNotionNodeToString from './convertNotionNodeToString'
import convertNotionNodeToStrings from './convertNotionNodeToStrings'
import handleError from './handleError'
import slugify from './slugify'

export default function generateInstitutionFromNotionInstitution(notionInstitution: NotionInstitution) {
  try {
    const { id } = notionInstitution
    const title = convertNotionNodeToHtml(notionInstitution.properties.Titre, true)
    if (title === undefined) {
      throw new Error(`Notion institution #${id} has an undefined title.`)
    }

    return new Institution({
      address: convertNotionNodeToHtml(notionInstitution.properties.Adresse),
      addressFiles: notionInstitution.properties['Adresse bis'].files,
      challenges: convertNotionNodeToHtml(notionInstitution.properties['Nos enjeux']),
      fullName: convertNotionNodeToString(notionInstitution.properties['Nom complet']),
      hiringProcess: convertNotionNodeToHtml(notionInstitution.properties['Processus de recrutement']),
      id,
      // jobsLink: convertNotionNodeToStrings(notionInstitution.properties['Toutes les offres disponibles']),
      isPublished: convertNotionNodeToBoolean(notionInstitution.properties.EstPublie),
      joinTeam: convertNotionNodeToHtml(notionInstitution.properties['Nous rejoindre - Pourquoi?']),
      joinTeamFiles: convertNotionNodeToHtmls(notionInstitution.properties['Nous rejoindre - Infos']),
      keyNumbers: convertNotionNodeToHtml(notionInstitution.properties['Les chiffres clés']),
      keyNumbersMedia: convertNotionNodeToStrings(notionInstitution.properties['Les chiffres clés - liens']),
      logoUrl: convertNotionNodeToString(notionInstitution.properties['Bloc marque']),
      missions: convertNotionNodeToHtml(notionInstitution.properties['Nos missions']),
      motivation: convertNotionNodeToHtml(notionInstitution.properties["Raison d'être"]),
      motivationFiles: convertNotionNodeToHtmls(notionInstitution.properties["Raison d'être complément"]),
      organization: convertNotionNodeToHtml(notionInstitution.properties['Notre organisation']),
      organizationFiles: convertNotionNodeToHtmls(notionInstitution.properties['Notre organisation compléments']),
      profile: convertNotionNodeToHtml(notionInstitution.properties['Ton profil']),
      project: convertNotionNodeToHtml(notionInstitution.properties['Les projets ou rélisations']),
      projectFiles: convertNotionNodeToHtmls(notionInstitution.properties['Projets ou réalisations compléments']),
      schedule: convertNotionNodeToHtml(notionInstitution.properties.Agenda),
      slug: slugify(title, id),
      socialNetworkUrls: convertNotionNodeToStrings(notionInstitution.properties['Réseaux sociaux']),
      testimonial: convertNotionNodeToHtml(notionInstitution.properties['Nos agents en parlent']),
      testimonialFiles: convertNotionNodeToHtmls(notionInstitution.properties['Liens Nos agents en parlent']),
      thumbnailUrl: convertNotionNodeToString(notionInstitution.properties['Vignette temporaire']),
      title,
      value: convertNotionNodeToHtml(notionInstitution.properties.Valeurs),
      valueFiles: convertNotionNodeToHtmls(notionInstitution.properties['Valeurs complément']),
      websiteFiles: notionInstitution.properties['Site(s) institutionel(s)'].files,
    })
  } catch (err) {
    handleError(err, 'helpers/generateInstitutionFromNotionInstitution()')
  }
}
