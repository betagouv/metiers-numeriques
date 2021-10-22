import { DateProvider } from '../shared/dateProvider';
import { JobsService, MinistriesService } from './interfaces';

const { isBefore, parse, sub } = require('date-fns');

const { JOB_FILTERS } = require('./utils');

export const listJobs = async (deps: { jobsService: JobsService }, params: any) => {
    return await deps.jobsService.all(params);
};

export const getJob = async (id: string, deps: { jobsService: JobsService }, tag: string) => {
    return await deps.jobsService.get(id, tag);
};

export const updateLatestActivePepJobs = async (pepJob: any, deps: { jobsService: JobsService, dateProvider: DateProvider }) => {
    // import only offers published since yesterday
    // let isNew = moment(pepJob.FirstPublicationDate, 'DD/MM/YYYY hh:mm:ss') > date;
    let isNew = isBefore(
        parse(pepJob.FirstPublicationDate, 'dd/MM/yyyy hh:mm:ss', deps.dateProvider.date()),
        sub(deps.dateProvider.date(), { days: 1 }),
    );
    if (process.env.CRON_IMPORT_ALL) {
        isNew = true;
    }
    if (pepJob.JobDescription_ProfessionalCategory_ === 'Vacant' && JOB_FILTERS.includes(pepJob.JobDescription_PrimaryProfile_) && isNew) {
        const page = await deps.jobsService.getPage(process.env.PEP_DATABASE_ID!, pepJob.OfferID);
        if (!page) {
            await deps.jobsService.createPage(process.env.PEP_DATABASE_ID!, pepJob);
        }
        return true;
    }

    return false;
};

export const listMinistries = async (deps: { ministriesService: MinistriesService }) => {
    return await deps.ministriesService.listMinistries();
};

export const getMinistry = async (id: string, deps: { ministriesService: MinistriesService }) => {
    return await deps.ministriesService.getMinistry(id);
};
