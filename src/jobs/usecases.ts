import { DateProvider } from '../shared/dateProvider';
import { JobsService, MinistriesService } from './interfaces';

const { isBefore, parse, sub } = require('date-fns');

const { JOB_FILTERS } = require('./utils');

export const listJobs = async (dependencies: { jobsService: JobsService }, params: any) => {
    return await dependencies.jobsService.all(params);
};

export const getJob = async (id: string, dependencies: { jobsService: JobsService }, tag: string) => {
    return await dependencies.jobsService.get(id, tag);
};

export const updateLatestActivePepJobs = async (pepJob: any, dependencies: { jobsService: JobsService, dateProvider: DateProvider }) => {
    // import only offers published since yesterday
    // let isNew = moment(pepJob.FirstPublicationDate, 'DD/MM/YYYY hh:mm:ss') > date;
    let isNew = isBefore(
        parse(pepJob.FirstPublicationDate, 'dd/MM/yyyy hh:mm:ss', dependencies.dateProvider.date()),
        sub(dependencies.dateProvider.date(), { days: 1 }),
    );
    if (process.env.CRON_IMPORT_ALL) {
        isNew = true;
    }
    if (pepJob.JobDescription_ProfessionalCategory_ === 'Vacant' && JOB_FILTERS.includes(pepJob.JobDescription_PrimaryProfile_) && isNew) {
        const page = await dependencies.jobsService.getPage(process.env.PEP_DATABASE_ID!, pepJob.OfferID);
        if (!page) {
            await dependencies.jobsService.createPage(process.env.PEP_DATABASE_ID!, pepJob);
        }
        return true;
    }

    return false;
};

export const listMinistries = async (dependencies: { ministriesService: MinistriesService }) => {
    return await dependencies.ministriesService.listMinistries();
};

export const getMinistry = async (id: string, dependencies: { ministriesService: MinistriesService }) => {
    return await dependencies.ministriesService.getMinistry(id);
};
