interface JobProps {
  /** ISO Date */
  $createdAt: string
  /** Used as an internal reference for debugging purposes */
  $reference: string
  /** ISO Date */
  $updatedAt: string

  advantages?: string
  conditions?: string
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
  salary?: string
  slug: string
  tasks?: string
  team?: string
  teamInfo?: string
  title: string
  toApply?: string
}

class Job implements JobProps {
  /** ISO Date */
  public $createdAt: string
  /** Used as an internal reference for debugging purposes */
  public $reference: string
  /** ISO Date */
  public $updatedAt: string

  public id: string
  public slug: string
  public title: string

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
  public tasks?: string
  public team?: string
  public teamInfo?: string
  public toApply?: string

  constructor({
    $createdAt,
    $reference,
    $updatedAt,
    advantages,
    conditions,
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
    salary,
    slug,
    tasks,
    team,
    teamInfo,
    title,
    toApply,
  }: JobProps) {
    this.$createdAt = $createdAt
    this.$reference = $reference
    this.$updatedAt = $updatedAt

    this.advantages = advantages
    this.conditions = conditions
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
    this.salary = salary
    this.slug = slug
    this.tasks = tasks
    this.team = team
    this.teamInfo = teamInfo
    this.title = title
    this.toApply = toApply
  }
}

export default Job
