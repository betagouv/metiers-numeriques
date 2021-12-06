import Service from './Service'

interface JobProps {
  advantages?: string
  conditions?: string
  /** ISO Date */
  createdAt: string
  department?: string[]
  entity?: string
  experiences?: string[]
  hiringProcess?: string
  id: string
  limitDate?: string
  locations?: string[]
  mission?: string
  more?: string
  openedToContractTypes?: string[]
  profile?: string
  publicationDate?: string
  /** Used as an internal reference for debugging purposes */
  reference: string
  salary?: string
  service?: Service
  slug: string
  tasks?: string
  team?: string
  teamInfo?: string
  title: string
  toApply?: string
  /** ISO Date */
  updatedAt: string
  /** Humanized date (i.e.: "Il y a 7 jours") */
  updatedDate: string
}

export default class Job implements JobProps {
  /** ISO Date */
  public createdAt: string
  public id: string
  /** Used as an internal reference for debugging purposes */
  public reference: string
  public slug: string
  public title: string
  /** ISO Date */
  public updatedAt: string

  public advantages?: string
  public conditions?: string
  public department: string[] = []
  public entity?: string
  public experiences: string[] = []
  public hiringProcess?: string
  public limitDate?: string
  public locations: string[] = []
  public mission?: string
  public more?: string
  public openedToContractTypes: string[]
  public profile?: string
  public publicationDate?: string
  public salary?: string
  public service?: Service
  public tasks?: string
  public team?: string
  public teamInfo?: string
  public toApply?: string
  /** Humanized date (i.e.: "Il y a 7 jours") */
  public updatedDate: string

  constructor({
    advantages,
    conditions,
    createdAt,
    department,
    entity,
    experiences,
    hiringProcess,
    id,
    limitDate,
    locations,
    mission,
    more,
    openedToContractTypes,
    profile,
    publicationDate,
    reference,
    salary,
    service,
    slug,
    tasks,
    team,
    teamInfo,
    title,
    toApply,
    updatedAt,
    updatedDate,
  }: JobProps) {
    this.advantages = advantages
    this.conditions = conditions
    this.createdAt = createdAt
    this.department = department || []
    this.entity = entity
    this.experiences = experiences || []
    this.hiringProcess = hiringProcess
    this.id = id
    this.limitDate = limitDate
    this.locations = locations || []
    this.mission = mission
    this.more = more
    this.openedToContractTypes = openedToContractTypes || []
    this.profile = profile
    this.publicationDate = publicationDate
    this.reference = reference
    this.salary = salary
    this.service = service
    this.slug = slug
    this.tasks = tasks
    this.team = team
    this.teamInfo = teamInfo
    this.title = title
    this.toApply = toApply
    this.updatedAt = updatedAt
    this.updatedDate = updatedDate
  }
}
