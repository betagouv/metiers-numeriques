'use strict';

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
                    id,
                    title,
                    mission,
                    tasks,
                    profile,
                    experiences,
                    locations,
                    department,
                    openedToContractTypes,
                    salary,
                    team,
                    slug,
                    hiringProcess = null,
                    publicationDate= null,
                    conditions,
                    teamInfo,
                    toApply,
                    more = null,
                    limitDate
                }) {
        this.id = id;
        this.title = title;
        this.mission = mission;
        this.experiences = experiences;
        this.locations = locations;
        this.department = department;
        this.openedToContractTypes = openedToContractTypes;
        this.salary = salary;
        this.team = team;
        this.tasks = tasks;
        this.profile = profile;
        this.slug = slug;
        this.hiringProcess = hiringProcess;
        this.publicationDate = publicationDate;
        this.conditions = conditions
        this.teamInfo = teamInfo
        this.toApply = toApply
        this.more = more
        this.limitDate = limitDate
    }
};


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
 * @property {string[]} keyNumbers
 * @property {string[]} keyNumbersMedia
 * @property {string[]} missions
 * @property {string} projects
 * @property {string} testimonials
 * @property {string[]} testimonialsMedia
 * @property {string} joinTeam
 * @property {string} joinTeamInfos
 * @property {string} motivation
 * @property {string} motivationMedia
 * @property {string[]} profile
 * @property {string} website
 * @property {string[]} jobsLinks
 * @property {string[]} values
 * @property {string} schedule
 * @property {string[]} socialNetworks
 * @property {string} visualBanner
 * @property {string} challenges
 * @property {string} organization
 * @property {string} organizationMedia
 * @property {string} recruitmentProcess
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
        id,
        title,
        description,
        fullName,
        adress,
        adressBis,
        brandBlock,
        keyNumbers,
        keyNumbersMedia,
        missions,
        projects,
        testimonials,
        testimonialsMedia,
        joinTeam,
        joinTeamInfos,
        motivation,
        motivationMedia,
        profile,
        website,
        jobsLinks,
        values,
        schedule,
        socialNetworks,
        visualBanner,
        challenges,
        organization,
        organizationMedia,
        recruitmentProcess,
        hiringProcess,
        slug,
        publicationDate = null,
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.fullName = fullName,
        this.adress = adress,
        this.adressBis = adressBis,
        this.brandBlock = brandBlock,
        this.keyNumbers = keyNumbers,
        this.keyNumbersMedia = keyNumbersMedia,
        this.missions = missions,
        this.projects = projects,
        this.testimonials = testimonials,
        this.testimonialsMedia = testimonialsMedia,
        this.joinTeam = joinTeam,
        this.joinTeamInfos = joinTeamInfos,
        this.motivation = motivation,
        this.motivationMedia = motivationMedia,
        this.profile = profile,
        this.website = website,
        this.jobsLinks = jobsLinks,
        this.values = values,
        this.schedule = schedule,
        this.socialNetworks = socialNetworks,
        this.visualBanner = visualBanner,
        this.challenges = challenges,
        this.organization = organization,
        this.organizationMedia = organizationMedia,
        this.recruitmentProcess = recruitmentProcess,
        this.hiringProcess = hiringProcess,
        this.slug = slug,
        this.publicationDate = publicationDate
    }
};

