import { Request, Response } from 'express';
import { institutionsService, jobsService, uuidGenerator } from './dependencies';
import * as usecases from './usecases';
import { AddInstitutionDTO, AddJobDTO } from './usecases';
import { dateReadableFormat } from './utils';

export async function list(req: Request, res: Response) {
    try {
        const requestedOffset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
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

export async function add(req: Request, res: Response) {
    if (req.method == 'POST') {
        const dto: AddJobDTO = {
            title: req.body.title,
            institutionId: req.body.institution,
            publicationDate: req.body.publicationDate,
            limitDate: req.body.limitDate,
            team: req.body.team,
            experiences: req.body.experiences,
            availableContracts: req.body.availableContracts,
            details: {
                mission: req.body.mission,
                team: req.body.team,
                locations: req.body.locations,
                teamInfo: req.body.teamInfo,
                tasks: req.body.tasks,
                profile: req.body.profile,
                salary: req.body.salary,
                hiringProcess: req.body.hiringProcess,
                conditions: req.body.conditions,
                advantages: req.body.advantages,
                more: req.body.more,
                toApply: req.body.toApply,
            },
        };

        await usecases.addJob(dto, { jobsService, uuidGenerator });
        res.redirect('/annonces');
    } else {
        res.render('addJob', {
            contactEmail: 'contact@metiers.numerique.gouv.fr',
        });
    }
}


// Institutions
export async function listInstitutions(_: Request, res: Response) {
    try {
        const ministries = await usecases.listInstitutions({
            institutionsService,
        });

        res.render('ministries', {
            ministries: ministries,
            contactEmail: 'contact@metiers.numerique.gouv.fr',
        });
    } catch (e) {
        console.log(e);
    }
}

export async function getInstitution(req: Request, res: Response) {
    const ministry = await usecases.getInstitution(req.query.id as string, { institutionsService });
    res.render('institutionDetail', {
        job: ministry,
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
}

export async function addInstitution(req: Request, res: Response) {
    if (req.method == 'POST') {
        const dto: AddInstitutionDTO = {
            name: req.body.name,
            description: req.body.description,
        };
        await usecases.addInstitution(dto, { institutionsService });
        res.redirect('/institutions');
    } else {
        res.render('addInstitution', {
            contactEmail: 'contact@metiers.numerique.gouv.fr',
        });
    }
}
