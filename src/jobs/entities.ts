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
 * @property {string} description
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
                    description
                }) {
        this.id = id;
        this.description = description;
    }
};

