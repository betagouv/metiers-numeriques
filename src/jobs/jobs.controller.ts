import { Request, Response } from 'express';
import { jobsService } from './dependencies';
import * as usecases from './usecases';
import { dateReadableFormat } from './utils';

export async function list(req: Request, res: Response) {
    try {
        const requestedOffset = req.query.offset ? parseInt(req.query.offset as string): undefined;
        const { jobs, offset } = await usecases.listJobs({
            offset: requestedOffset,
        }, {
            jobsService,
        });
        // const view = req.query.start_cursor ? 'partials/jobList' : 'jobs';
        res.render('jobs', {
            jobs: jobs,
            dateReadableFormat,
            offset,
            contactEmail: 'contact@metiers.numerique.gouv.fr',
        });
    } catch (e) {
        console.log(e);
    }
}

export async function get(req: Request, res: Response) {
    const id = req.params.id;
    const result = await usecases.getJob(id, { jobsService });
    res.render('jobDetail', {
        job: result,
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
}

// export async function listMinistries(_: Request, res: Response) {
//     try {
//         const ministries = await usecases.listMinistries({
//             ministriesService,
//         });
//
//         res.render('ministries', {
//             ministries: ministries,
//             contactEmail: 'contact@metiers.numerique.gouv.fr',
//         });
//     } catch (e) {
//         console.log(e);
//     }
// }
//
// export async function getMinistry(req: Request, res: Response) {
//     const ministry = await usecases.getMinistry(req.query.id as string, { ministriesService });
//     res.render('ministryDetail', {
//         job: ministry,
//         contactEmail: 'contact@metiers.numerique.gouv.fr',
//     });
// }
