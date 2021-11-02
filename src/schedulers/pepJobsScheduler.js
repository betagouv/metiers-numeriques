const axios = require('axios');
const csv = require('csvtojson');
const usecases = require('../jobs/usecases');
const { jobsRepository } = require('../jobs/dependencies');
const { dateProvider } = require('../shared/dependencies');

module.exports.fetchPepJobs = async () => {
    try {
        let count = 0;
        csv({
                delimiter: ';',
            },
        ).fromStream(((await axios.get(process.env.PEP_ENDPOINT, {
                responseType: 'stream',
            })).data),
        ).subscribe( (pepJob) => {
            return new Promise(async (resolve, reject) => {
                    await usecases.updateLatestActivePepJobs(pepJob, { jobsRepository, dateProvider });
                    count++;
                resolve();
            })
        }, () => {
        }, () => {
        });
    } catch (err) {
        console.log(err);
        throw new Error('Erreur lors de la récupération des offres de la pep');
    }
};
