type InstitutionProps = {
  address: string | null
  addressFiles: Common.Data.File[]
  challenges: string | null
  fullName: string | null
  hiringProcess: string | null
  id: string
  isPublished: boolean
  joinTeam: string | null
  joinTeamFiles: Common.Data.File[]
  keyNumbers: string | null
  keyNumbersFiles: Common.Data.File[]
  logoFile: Common.Data.File | null
  missions: string | null
  motivation: string | null
  motivationFiles: Common.Data.File[]
  organization: string | null
  organizationFiles: Common.Data.File[]
  profile: string | null
  project: string | null
  projectFiles: Common.Data.File[]
  schedule: string | null
  slug: string
  socialNetworkUrls: string[]
  testimonial: string | null
  testimonialFiles: Common.Data.File[]
  thumbnailFile: Common.Data.File | null
  title: string
  value: string | null
  valueFiles: Common.Data.File[]
  websiteUrls: string[]
}

export default class Institution implements InstitutionProps {
  public id: string

  public address: string | null = null
  public addressFiles: Common.Data.File[]
  public challenges: string | null
  public fullName: string | null
  public hiringProcess: string | null
  public isPublished: boolean
  public joinTeam: string | null
  public joinTeamFiles: Common.Data.File[]
  public keyNumbers: string | null
  public keyNumbersFiles: Common.Data.File[]
  public logoFile: Common.Data.File | null
  public missions: string | null
  public motivation: string | null
  public motivationFiles: Common.Data.File[]
  public organization: string | null
  public organizationFiles: Common.Data.File[]
  public profile: string | null
  public project: string | null
  public projectFiles: Common.Data.File[]
  public schedule: string | null
  public slug: string
  public socialNetworkUrls: string[]
  public testimonial: string | null
  public testimonialFiles: Common.Data.File[]
  public thumbnailFile: Common.Data.File | null
  public title: string
  public value: string | null
  public valueFiles: Common.Data.File[]
  public websiteUrls: string[]

  constructor({
    address,
    addressFiles,
    challenges,
    fullName,
    hiringProcess,
    id,
    isPublished,
    joinTeam,
    joinTeamFiles,
    keyNumbers,
    keyNumbersFiles,
    logoFile,
    missions,
    motivation,
    motivationFiles,
    organization,
    organizationFiles,
    profile,
    project,
    projectFiles,
    schedule,
    slug,
    socialNetworkUrls,
    testimonial,
    testimonialFiles,
    thumbnailFile,
    title,
    value,
    valueFiles,
    websiteUrls,
  }: InstitutionProps) {
    this.id = id

    this.address = address
    this.addressFiles = addressFiles
    this.challenges = challenges
    this.fullName = fullName
    this.hiringProcess = hiringProcess
    this.isPublished = isPublished
    this.joinTeam = joinTeam
    this.joinTeamFiles = joinTeamFiles
    this.keyNumbers = keyNumbers
    this.keyNumbersFiles = keyNumbersFiles
    this.logoFile = logoFile
    this.missions = missions
    this.motivation = motivation
    this.motivationFiles = motivationFiles
    this.organization = organization
    this.organizationFiles = organizationFiles
    this.profile = profile
    this.project = project
    this.projectFiles = projectFiles
    this.schedule = schedule
    this.slug = slug
    this.socialNetworkUrls = socialNetworkUrls
    this.testimonial = testimonial
    this.testimonialFiles = testimonialFiles
    this.thumbnailFile = thumbnailFile
    this.title = title
    this.value = value
    this.valueFiles = valueFiles
    this.websiteUrls = websiteUrls
  }
}
