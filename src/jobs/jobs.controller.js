'use strict';

const usecases = require('./usecases');
const {jobsRepository} = require('./dependencies');

module.exports.list = async (req, res) => {
    try {
        const result = await usecases.listJobs({jobsRepository});
        res.render('jobs', {
            jobs: result,
            contactEmail: 'contact@metiers.numerique.gouv.fr',
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports.get = async (req, res) => {
    const result = await usecases.getJob(req.params.id, {jobsRepository});
    res.render('jobDetail', {
        job: result,
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
};
