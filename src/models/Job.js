/**
 * JobParams
 * @typedef {Object} JobParams
 * @property {string} id
 * @property {string} title
 * @property {string} mission
 * @property {string[]} tasks
 * @property {string} profile
 * @property {string[]} experiences
 * @property {string[]} locations
 * @property {string[]} department
 * @property {string} entity
 * @property {string[]} openedToContractTypes
 * @property {string} salary
 * @property {string} team
 * @property {string} slug
 * @property {string|null} [hiringProcess]
 * @property {Date|null} [publicationDate]
 * @property {string[]} conditions
 * @property {string} teamInfo
 * @property {string} toApply
 * @property {string|null} [more]
 * @property {Date} limitDate
 * @property {string|null} advantages
 */

/**
 * @extends JobParams
 * @class
 */
class Job {
  /**
   * @param {JobParams} job
   */
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
  }) {
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

module.exports = Job
