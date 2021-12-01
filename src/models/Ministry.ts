type MinistryProps = {
  adress: string
  adressBis: string
  brandBlock: string
  challenges: string
  description?: string
  fullName: string
  hiringProcess: string
  id: string
  jobsLink: string[]
  joinTeam: string
  joinTeamMedia: string
  keyNumbers: string
  keyNumbersMedia: string[]
  missions: string
  motivation: string
  motivationMedia: string
  organization: string
  organizationMedia: string
  profile: string
  projects: string
  projectsMedia: string
  publicationDate: Date | null
  schedule: string
  slug: string
  socialNetworks: string[]
  testimonials: string
  testimonialsMedia: string[]
  thumbnail: string
  title: string
  values: string
  valuesMedia: string[]
  visualBanner: string
  websites: string[]
}

class Ministry {
  public adress: string
  public adressBis: string
  public brandBlock: string
  public challenges: string
  public description?: string
  public fullName: string
  public hiringProcess: string
  public id: string
  public jobsLink: string[]
  public joinTeam: string
  public joinTeamMedia: string
  public keyNumbers: string
  public keyNumbersMedia: string[]
  public missions: string
  public motivation: string
  public motivationMedia: string
  public organization: string
  public organizationMedia: string
  public profile: string
  public projects: string
  public projectsMedia: string
  public publicationDate: Date | null
  public schedule: string
  public slug: string
  public socialNetworks: string[]
  public testimonials: string
  public testimonialsMedia: string[]
  public thumbnail: string
  public title: string
  public values: string
  public valuesMedia: string[]
  public visualBanner: string
  public websites: string[]

  constructor({
    adress,
    adressBis,
    brandBlock,
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
    missions,
    motivation,
    motivationMedia,
    organization,
    organizationMedia,
    profile,
    projects,
    projectsMedia,
    publicationDate = null,
    schedule,
    slug,
    socialNetworks,
    testimonials,
    testimonialsMedia,
    thumbnail,
    title,
    values,
    valuesMedia,
    visualBanner,
    websites,
  }: MinistryProps) {
    this.id = id
    this.title = title
    this.description = description
    this.fullName = fullName
    this.adress = adress
    this.adressBis = adressBis
    this.brandBlock = brandBlock
    this.thumbnail = thumbnail
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
    this.motivationMedia = motivationMedia
    this.profile = profile
    this.websites = websites
    this.jobsLink = jobsLink
    this.values = values
    this.valuesMedia = valuesMedia
    this.schedule = schedule
    this.socialNetworks = socialNetworks
    this.visualBanner = visualBanner
    this.challenges = challenges
    this.organization = organization
    this.organizationMedia = organizationMedia
    this.hiringProcess = hiringProcess
    this.slug = slug
    this.publicationDate = publicationDate
  }
}

export default Ministry
