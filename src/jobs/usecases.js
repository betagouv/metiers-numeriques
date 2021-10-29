'use strict';

const { isBefore, parse, sub } = require('date-fns');

const { JOB_FILTERS } = require('./utils');

const listJobs = async ({ jobsRepository }, params) => {
    return await jobsRepository.all(params);
};

const getJob = async (id, { jobsRepository }, tag) => {
    return await jobsRepository.get(id, tag);
};

const updateLatestActivePepJobs = async (pepJob, { jobsRepository, dateProvider }) => {
    // import only offers published since yesterday
    // let isNew = moment(pepJob.FirstPublicationDate, 'DD/MM/YYYY hh:mm:ss') > date;
    let isNew = isBefore(
        parse(pepJob.FirstPublicationDate, 'dd/MM/yyyy hh:mm:ss', dateProvider.date()),
        sub(dateProvider.date(), { days: 1 })
    )
    if (process.env.CRON_IMPORT_ALL) {
        isNew = true;
    }
    if (pepJob.JobDescription_ProfessionalCategory_ === 'Vacant' && JOB_FILTERS.includes(pepJob.JobDescription_PrimaryProfile_) && isNew) {
        const page = await jobsRepository.getPage(process.env.PEP_DATABASE_ID, pepJob.OfferID);
        if (!page) {
            await jobsRepository.createPage(process.env.PEP_DATABASE_ID, pepJob);
        }
        return true
    }

    return false;
};

const listMinistries = async ({ ministriesRepository }, params) => {
    return await ministriesRepository.all(params);
};

const getMinistry = async (id, { ministriesRepository }) => {
    return await ministriesRepository.getMinistry(id);
};

module.exports = {
    listJobs,
    getJob,
    updateLatestActivePepJobs,

    listMinistries,
    getMinistry
};
