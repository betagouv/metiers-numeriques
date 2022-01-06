interface JobProps {
  advantages: string | null
  conditions: string | null
  createdAt: Date
  department: string[]
  entity: string | null
  experiences: string[]
  hiringProcess: string | null
  id: string
  legacyServiceId: string | null
  limitDate: Date | null
  locations: string[]
  mission: string | null
  more: string | null
  openedToContractTypes: string[]
  profile: string | null
  publicationDate: Date | null
  /** Used as an internal reference for debugging purposes */
  reference: string
  salary: string | null
  slug: string
  tasks: string | null
  team: string | null
  teamInfo: string | null
  title: string
  toApply: string | null
  updatedAt: Date
  /** Humanized date (i.e.: "Il y a 7 jours") */
  // updatedDate: string
}

export default class Job implements JobProps {
  public createdAt: Date
  public id: string
  /** Used as an internal reference for debugging purposes */
  public reference: string
  public slug: string
  public title: string
  public updatedAt: Date

  public advantages: string | null
  public conditions: string | null
  public department: string[]
  public entity: string | null
  public experiences: string[]
  public hiringProcess: string | null
  public legacyServiceId: string | null
  public limitDate: Date | null
  public locations: string[]
  public mission: string | null
  public more: string | null
  public openedToContractTypes: string[]
  public profile: string | null
  public publicationDate: Date | null
  public salary: string | null
  public tasks: string | null
  public team: string | null
  public teamInfo: string | null
  public toApply: string | null
  /** Humanized date (i.e.: "Il y a 7 jours") */
  // public updatedDate: string

  constructor({
    advantages,
    conditions,
    createdAt,
    department,
    entity,
    experiences,
    hiringProcess,
    id,
    legacyServiceId,
    limitDate,
    locations,
    mission,
    more,
    openedToContractTypes,
    profile,
    publicationDate,
    reference,
    salary,
    slug,
    tasks,
    team,
    teamInfo,
    title,
    toApply,
    updatedAt,
  }: JobProps) {
    this.advantages = advantages
    this.conditions = conditions
    this.createdAt = createdAt
    this.department = department || []
    this.entity = entity
    this.experiences = experiences || []
    this.hiringProcess = hiringProcess
    this.id = id
    this.legacyServiceId = legacyServiceId
    this.limitDate = limitDate
    this.locations = locations || []
    this.mission = mission
    this.more = more
    this.openedToContractTypes = openedToContractTypes || []
    this.profile = profile
    this.publicationDate = publicationDate
    this.reference = reference
    this.salary = salary
    this.slug = slug
    this.tasks = tasks
    this.team = team
    this.teamInfo = teamInfo
    this.title = title
    this.toApply = toApply
    this.updatedAt = updatedAt
    // this.updatedDate = updatedDate
  }
}
