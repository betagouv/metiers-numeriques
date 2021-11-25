/* eslint-disable max-classes-per-file */

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
module.exports.Job = class Job {
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

/**
 * MinistryParams
 * @typedef {Object} MinistryParams
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} fullName
 * @property {string} adress
 * @property {string} adressBis
 * @property {string} brandBlock
 * @property {string} thumbnail
 * @property {string} keyNumbers
 * @property {string[]} keyNumbersMedia
 * @property {string[]} missions
 * @property {string} projects
 * @property {string} projectsMedia
 * @property {string} testimonials
 * @property {string[]} testimonialsMedia
 * @property {string} joinTeam
 * @property {string} joinTeamInfos
 * @property {string} motivation
 * @property {string} motivationMedia
 * @property {string} profile
 * @property {string[]} websites
 * @property {string[]} jobsLink
 * @property {string[]} values
 * @property {string[]} valuesMedia
 * @property {string} schedule
 * @property {string[]} socialNetworks
 * @property {string} visualBanner
 * @property {string} challenges
 * @property {string} organization
 * @property {string} organizationMedia
 * @property {string} hiringProcess
 * @property {string} slug
 * @property {Date|null} [publicationDate]
 */

/**
 * @extends MinistryParams
 * @class
 */
module.exports.Ministry = class Ministry {
  /**
   * @param {MinistryParams} ministry
   */
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
  }) {
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
