import { Request, Response } from 'express';
import { jobsService, ministriesService } from './dependencies';
import * as usecases from './usecases';
import { dateReadableFormat } from './utils';

export async function list(req: Request, res: Response) {
    try {
        const { jobs, nextCursor, hasMore } = await usecases.listJobs({
            startCursor: req.query.start_cursor || undefined,
        }, {
            jobsService,
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
}

export async function get(req: Request, res: Response) {
    const id = req.url.split('-').slice(-5).join('-').split('?')[0];
    const tag = req.query.tag as string;
    const result = await usecases.getJob(id, { jobsService }, tag);
    res.render('jobDetail', {
        job: result,
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
}

export async function listMinistries(_req: Request, res: Response) {
    try {
        const ministries = await usecases.listMinistries({
            ministriesService,
        });

        res.render('ministries', {
            ministries: ministries,
            contactEmail: 'contact@metiers.numerique.gouv.fr',
        });
    } catch (e) {
        console.log(e);
    }
}

export async function getMinistry(req: Request, res: Response) {
    const ministry = await usecases.getMinistry(req.query.id as string, { ministriesService });
    res.render('ministryDetail', {
        job: ministry,
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
}
