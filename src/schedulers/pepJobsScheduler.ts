const axios = require('axios');
const csv = require('csvtojson');
const usecases = require('../jobs/usecases');
const { jobsService } = require('../jobs/dependencies');
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
        ).subscribe((pepJob) => {
            return new Promise(async (resolve, reject) => {
                await usecases.updateLatestActivePepJobs(pepJob, { jobsRepository: jobsService, dateProvider });
                count++;
                resolve();
            });
        }, () => {
        }, () => {
        });
    } catch (e) {
        console.log(e);
        throw new Error('Erreur lors de la récupération des offres de la pep');
    }
};
