import { NotionDatabaseItemPropertyAsFiles } from '../types/Notion'

type MinistryProps = {
  adress?: string
  challenges?: string
  description?: string
  fullName: string
  hiringProcess?: string
  id: string
  jobsLink: string[]
  joinTeam?: string
  joinTeamMedia: string[]
  keyNumbers?: string
  keyNumbersMedia: string[]
  logoUrl?: string
  missions?: string
  motivation?: string
  motivationFiles: NotionDatabaseItemPropertyAsFiles['files']
  organization?: string
  organizationFiles: NotionDatabaseItemPropertyAsFiles['files']
  otherAdresses: NotionDatabaseItemPropertyAsFiles['files']
  profile?: string
  projects?: string
  projectsMedia: string[]
  publicationDate?: Date
  schedule?: string
  slug: string
  socialNetworkUrls: string[]
  testimonials?: string
  testimonialsMedia: string[]
  thumbnailUrl: string
  title: string
  values?: string
  valuesMedia: string[]
  visualBanner?: string
  websiteFiles: NotionDatabaseItemPropertyAsFiles['files']
}

class Ministry implements MinistryProps {
  public id: string
  public slug: string
  public title: string
  public fullName: string
  public thumbnailUrl: string

  public adress?: string
  public challenges?: string
  public description?: string
  public hiringProcess?: string
  public jobsLink: string[]
  public joinTeam?: string
  public joinTeamMedia: string[]
  public keyNumbers?: string
  public keyNumbersMedia: string[]
  public logoUrl?: string
  public missions?: string
  public motivation?: string
  public motivationFiles: NotionDatabaseItemPropertyAsFiles['files']
  public organization?: string
  public organizationFiles: NotionDatabaseItemPropertyAsFiles['files']
  public otherAdresses: NotionDatabaseItemPropertyAsFiles['files']
  public profile?: string
  public projects?: string
  public projectsMedia: string[]
  public publicationDate?: Date
  public schedule?: string
  public socialNetworkUrls: string[]
  public testimonials?: string
  public testimonialsMedia: string[]
  public values?: string
  public valuesMedia: string[]
  public websiteFiles: NotionDatabaseItemPropertyAsFiles['files']

  constructor({
    adress,
    challenges,
    description,
    fullName,
    hiringProcess,
    id,
    jobsLink,
    joinTeam,
    joinTeamMedia,
    keyNumbers,
    keyNumbersMedia,
    logoUrl,
    missions,
    motivation,
    motivationFiles,
    organization,
    organizationFiles,
    otherAdresses,
    profile,
    projects,
    projectsMedia,
    publicationDate,
    schedule,
    slug,
    socialNetworkUrls,
    testimonials,
    testimonialsMedia,
    thumbnailUrl,
    title,
    values,
    valuesMedia,
    websiteFiles,
  }: MinistryProps) {
    this.id = id
    this.title = title
    this.description = description
    this.fullName = fullName
    this.adress = adress
    this.otherAdresses = otherAdresses
    this.logoUrl = logoUrl
    this.thumbnailUrl = thumbnailUrl
    this.keyNumbers = keyNumbers
    this.keyNumbersMedia = keyNumbersMedia
    this.missions = missions
    this.projects = projects
    this.projectsMedia = projectsMedia
    this.testimonials = testimonials
    this.testimonialsMedia = testimonialsMedia
    this.joinTeam = joinTeam
    this.joinTeamMedia = joinTeamMedia
    this.motivation = motivation
    this.motivationFiles = motivationFiles
    this.profile = profile
    this.websiteFiles = websiteFiles
    this.jobsLink = jobsLink
    this.values = values
    this.valuesMedia = valuesMedia
    this.schedule = schedule
    this.socialNetworkUrls = socialNetworkUrls
    this.challenges = challenges
    this.organization = organization
    this.organizationFiles = organizationFiles
    this.hiringProcess = hiringProcess
    this.slug = slug
    this.publicationDate = publicationDate
  }
}

export default Ministry
