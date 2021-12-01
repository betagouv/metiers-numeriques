type JobProps = {
  advantages: string | null
  conditions: string[]
  department: string[]
  entity?: string | null
  experiences: string[]
  hiringProcess?: string | null
  id: string
  limitDate: string
  locations: string[]
  mission: string
  more: string | null
  openedToContractTypes: string[]
  profile: string[]
  publicationDate: Date | null
  salary?: string
  slug: string
  tasks?: string[]
  team: string
  teamInfo: string
  title: string
  toApply: string
}

class Job {
  public advantages: string | null
  public conditions: string[]
  public department: string[]
  public entity?: string | null
  public experiences: string[]
  public hiringProcess?: string | null
  public id: string
  public limitDate: string
  public locations: string[]
  public mission: string
  public more: string | null
  public openedToContractTypes: string[]
  public profile: string[]
  public publicationDate: Date | null
  public salary?: string
  public slug: string
  public tasks?: string[]
  public team: string
  public teamInfo: string
  public title: string
  public toApply: string

  constructor({
    advantages = null,
    conditions,
    department,
    entity,
    experiences,
    hiringProcess = null,
    id,
    limitDate,
    locations,
    mission,
    more = null,
    openedToContractTypes,
    profile,
    publicationDate = null,
    salary,
    slug,
    tasks,
    team,
    teamInfo,
    title,
    toApply,
  }: JobProps) {
    this.id = id
    this.title = title
    this.mission = mission
    this.experiences = experiences
    this.locations = locations
    this.department = department
    this.entity = entity
    this.openedToContractTypes = openedToContractTypes
    this.salary = salary
    this.team = team
    this.tasks = tasks
    this.profile = profile
    this.slug = slug
    this.hiringProcess = hiringProcess
    this.publicationDate = publicationDate
    this.conditions = conditions
    this.teamInfo = teamInfo
    this.toApply = toApply
    this.more = more
    this.limitDate = limitDate
    this.advantages = advantages
  }
}

export default Job
