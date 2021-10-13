'use strict';

const usecases = require('./usecases');
const { dateReadableFormat } = require('./utils');
const {jobsRepository} = require('./dependencies');

module.exports.list = async (req, res) => {
    try {
        const { jobs, nextCursor, hasMore } = await usecases.listJobs({
            jobsRepository
        }, {
            startCursor: req.query.start_cursor,
        });
        const view = req.query.start_cursor ? 'partials/jobList' : 'jobs';
        res.render(view, {
            jobs: jobs,
            dateReadableFormat,
            hasMore,
            nextCursor,
            contactEmail: 'contact@metiers.numerique.gouv.fr',
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports.get = async (req, res) => {
    const id = req.url.split('-').slice(-5).join('-').split('?')[0];
    const tag = req.query.tag
    const result = await usecases.getJob(id, {jobsRepository}, tag);
    res.render('jobDetail', {
        job: result,
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
};
