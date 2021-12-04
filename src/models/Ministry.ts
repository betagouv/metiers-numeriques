import { NotionDatabaseItemPropertyAsFiles } from '../types/Notion'

type MinistryProps = {
  address?: string
  addressFiles: NotionDatabaseItemPropertyAsFiles['files']
  challenges?: string
  description?: string
  fullName: string
  hiringProcess?: string
  id: string
  jobsLink: string[]
  joinTeam?: string
  joinTeamFiles: string[]
  keyNumbers?: string
  keyNumbersMedia: string[]
  logoUrl?: string
  missions?: string
  motivation?: string
  motivationFiles: string[]
  organization?: string
  organizationFiles: string[]
  profile?: string
  projectFiles: string[]
  projects?: string
  publicationDate?: Date
  schedule?: string
  slug: string
  socialNetworkUrls: string[]
  testimonials?: string
  testimonialsFiles: string[]
  thumbnailUrl: string
  title: string
  valueFiles: string[]
  values?: string
  visualBanner?: string
  websiteFiles: NotionDatabaseItemPropertyAsFiles['files']
}

class Ministry implements MinistryProps {
  public id: string
  public slug: string
  public title: string
  public fullName: string
  public thumbnailUrl: string

  public address?: string
  public addressFiles: NotionDatabaseItemPropertyAsFiles['files']
  public challenges?: string
  public description?: string
  public hiringProcess?: string
  public jobsLink: string[]
  public joinTeam?: string
  public joinTeamFiles: string[]
  public keyNumbers?: string
  public keyNumbersMedia: string[]
  public logoUrl?: string
  public missions?: string
  public motivation?: string
  public motivationFiles: string[]
  public organization?: string
  public organizationFiles: string[]
  public profile?: string
  public projects?: string
  public projectFiles: string[]
  public publicationDate?: Date
  public schedule?: string
  public socialNetworkUrls: string[]
  public testimonials?: string
  public testimonialsFiles: string[]
  public values?: string
  public valueFiles: string[]
  public websiteFiles: NotionDatabaseItemPropertyAsFiles['files']

  constructor({
    address,
    addressFiles,
    challenges,
    description,
    fullName,
    hiringProcess,
    id,
    jobsLink,
    joinTeam,
    joinTeamFiles,
    keyNumbers,
    keyNumbersMedia,
    logoUrl,
    missions,
    motivation,
    motivationFiles,
    organization,
    organizationFiles,
    profile,
    projectFiles,
    projects,
    publicationDate,
    schedule,
    slug,
    socialNetworkUrls,
    testimonials,
    testimonialsFiles,
    thumbnailUrl,
    title,
    valueFiles,
    values,
    websiteFiles,
  }: MinistryProps) {
    this.id = id
    this.title = title
    this.description = description
    this.fullName = fullName
    this.address = address
    this.addressFiles = addressFiles
    this.logoUrl = logoUrl
    this.thumbnailUrl = thumbnailUrl
    this.keyNumbers = keyNumbers
    this.keyNumbersMedia = keyNumbersMedia
    this.missions = missions
    this.projects = projects
    this.projectFiles = projectFiles
    this.testimonials = testimonials
    this.testimonialsFiles = testimonialsFiles
    this.joinTeam = joinTeam
    this.joinTeamFiles = joinTeamFiles
    this.motivation = motivation
    this.motivationFiles = motivationFiles
    this.profile = profile
    this.websiteFiles = websiteFiles
    this.jobsLink = jobsLink
    this.values = values
    this.valueFiles = valueFiles
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
