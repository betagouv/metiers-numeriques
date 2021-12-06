import { NotionPropertyAsFiles } from '../types/Notion'

type InstitutionProps = {
  address?: string
  addressFiles: NotionPropertyAsFiles['files']
  challenges?: string
  description?: string
  fullName: string
  hiringProcess?: string
  id: string
  // jobsLink: string[]
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
  project?: string
  projectFiles: string[]
  publicationDate?: Date
  schedule?: string
  slug: string
  socialNetworkUrls: string[]
  testimonial?: string
  testimonialFiles: string[]
  thumbnailUrl: string
  title: string
  value?: string
  valueFiles: string[]
  visualBanner?: string
  websiteFiles: NotionPropertyAsFiles['files']
}

export default class Institution implements InstitutionProps {
  public id: string
  public fullName: string
  public slug: string
  public thumbnailUrl: string
  public title: string

  public address?: string
  public addressFiles: NotionPropertyAsFiles['files']
  public challenges?: string
  public description?: string
  public hiringProcess?: string
  // public jobsLink: string[]
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
  public project?: string
  public projectFiles: string[]
  public publicationDate?: Date
  public schedule?: string
  public socialNetworkUrls: string[]
  public testimonial?: string
  public testimonialFiles: string[]
  public value?: string
  public valueFiles: string[]
  public websiteFiles: NotionPropertyAsFiles['files']

  constructor({
    address,
    addressFiles,
    challenges,
    description,
    fullName,
    hiringProcess,
    id,
    // jobsLink,
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
    project,
    projectFiles,
    publicationDate,
    schedule,
    slug,
    socialNetworkUrls,
    testimonial,
    testimonialFiles,
    thumbnailUrl,
    title,
    value,
    valueFiles,
    websiteFiles,
  }: InstitutionProps) {
    this.id = id
    this.fullName = fullName
    this.slug = slug
    this.title = title
    this.thumbnailUrl = thumbnailUrl

    this.address = address
    this.addressFiles = addressFiles
    this.challenges = challenges
    this.description = description
    this.hiringProcess = hiringProcess
    // this.jobsLink = jobsLink
    this.joinTeam = joinTeam
    this.joinTeamFiles = joinTeamFiles
    this.keyNumbers = keyNumbers
    this.keyNumbersMedia = keyNumbersMedia
    this.logoUrl = logoUrl
    this.missions = missions
    this.motivation = motivation
    this.motivationFiles = motivationFiles
    this.organization = organization
    this.organizationFiles = organizationFiles
    this.profile = profile
    this.project = project
    this.projectFiles = projectFiles
    this.publicationDate = publicationDate
    this.schedule = schedule
    this.socialNetworkUrls = socialNetworkUrls
    this.testimonial = testimonial
    this.testimonialFiles = testimonialFiles
    this.value = value
    this.valueFiles = valueFiles
    this.websiteFiles = websiteFiles
  }
}
