import axios from 'axios';

import csv from 'csvtojson';

import { jobsService } from '../jobs/dependencies';

import * as usecases from '../jobs/usecases';

import { dateProvider } from '../shared/dependencies';


export async function fetchPepJobs() {
    try {
        let count = 0;
        csv({
                delimiter: ';',
            },
        ).fromStream(((await axios.get(process.env.PEP_ENDPOINT!, {
                responseType: 'stream',
            })).data),
        ).subscribe((pepJob) => {
            return new Promise(async (resolve) => {
                await usecases.updateLatestActivePepJobs(pepJob, { jobsService, dateProvider });
                count++;
                resolve();
            });
        }, () => {
        }, () => {
            console.log(count);
        });
    } catch (e) {
        console.log(e);
        throw new Error('Erreur lors de la récupération des offres de la pep');
    }
}
