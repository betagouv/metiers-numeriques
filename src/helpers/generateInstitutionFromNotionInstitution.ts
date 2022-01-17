import Institution from '../models/Institution'
import { NotionInstitution } from '../types/NotionInstitution'
import convertNotionFilesNodeToFile from './convertNotionFilesNodeToFile'
import convertNotionFilesNodeToFiles from './convertNotionFilesNodeToFiles'
import convertNotionFilesNodeToUrls from './convertNotionFilesNodeToUrls'
import convertNotionNodeToPrismaValue from './convertNotionNodeToPrismaValue'
import convertNotionNodeToString from './convertNotionNodeToString'
import handleError from './handleError'
import slugify from './slugify'

export default function generateInstitutionFromNotionInstitution(notionInstitution: NotionInstitution) {
  try {
    const { id } = notionInstitution
    const title = convertNotionNodeToString(notionInstitution.properties.Titre) || '⚠️ {Titre} manquant'

    return new Institution({
      address: convertNotionNodeToPrismaValue(notionInstitution.properties.Adresse),
      addressFiles: convertNotionFilesNodeToFiles(notionInstitution.properties['Adresse bis']),
      challenges: convertNotionNodeToPrismaValue(notionInstitution.properties['Nos enjeux']),
      fullName: convertNotionNodeToString(notionInstitution.properties['Nom complet']),
      hiringProcess: convertNotionNodeToPrismaValue(notionInstitution.properties['Processus de recrutement']),
      id,
      isPublished: convertNotionNodeToPrismaValue(notionInstitution.properties.EstPublie),
      joinTeam: convertNotionNodeToPrismaValue(notionInstitution.properties['Nous rejoindre - Pourquoi?']),
      joinTeamFiles: convertNotionFilesNodeToFiles(notionInstitution.properties['Nous rejoindre - Infos']),
      keyNumbers: convertNotionNodeToPrismaValue(notionInstitution.properties['Les chiffres clés']),
      keyNumbersFiles: convertNotionFilesNodeToFiles(notionInstitution.properties['Les chiffres clés - liens']),
      logoFile: convertNotionFilesNodeToFile(notionInstitution.properties['Bloc marque']),
      missions: convertNotionNodeToPrismaValue(notionInstitution.properties['Nos missions']),
      motivation: convertNotionNodeToPrismaValue(notionInstitution.properties["Raison d'être"]),
      motivationFiles: convertNotionFilesNodeToFiles(notionInstitution.properties["Raison d'être complément"]),
      organization: convertNotionNodeToPrismaValue(notionInstitution.properties['Notre organisation']),
      organizationFiles: convertNotionFilesNodeToFiles(notionInstitution.properties['Notre organisation compléments']),
      profile: convertNotionNodeToPrismaValue(notionInstitution.properties['Ton profil']),
      project: convertNotionNodeToPrismaValue(notionInstitution.properties['Les projets ou rélisations']),
      projectFiles: convertNotionFilesNodeToFiles(notionInstitution.properties['Projets ou réalisations compléments']),
      schedule: convertNotionNodeToPrismaValue(notionInstitution.properties.Agenda),
      slug: slugify(title, id),
      socialNetworkUrls: convertNotionFilesNodeToUrls(notionInstitution.properties['Réseaux sociaux']),
      testimonial: convertNotionNodeToPrismaValue(notionInstitution.properties['Nos agents en parlent']),
      testimonialFiles: convertNotionFilesNodeToFiles(notionInstitution.properties['Liens Nos agents en parlent']),
      thumbnailFile: convertNotionFilesNodeToFile(notionInstitution.properties['Vignette temporaire']),
      title,
      value: convertNotionNodeToPrismaValue(notionInstitution.properties.Valeurs),
      valueFiles: convertNotionFilesNodeToFiles(notionInstitution.properties['Valeurs complément']),
      websiteUrls: convertNotionFilesNodeToUrls(notionInstitution.properties['Site(s) institutionel(s)']),
    })
  } catch (err) {
    handleError(err, 'helpers/generateInstitutionFromNotionInstitution()')
  }
}
