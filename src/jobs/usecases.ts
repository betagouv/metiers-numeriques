import { isError } from '../shared/utils';
import { createJob } from './entities';
import { JobsService, MinistriesService } from './interfaces';

export interface AddJobDTO {
    id?: string
    title: string;
    institution: string;
    team: string;
    availableContracts: string[]
    experiences: string[]
    publicationDate: string
    limitDate: string | null
    details: string
}
export const addJob = async (jobDTO: AddJobDTO, deps: { jobsService: JobsService }): Promise<void> => {
    const job = createJob(jobDTO);
    if (isError(job)) {
        throw job;
    }
    await deps.jobsService.add(job);
    return;
}

interface ListJobsParams {
    offset?: number;
    title?: string;
    institution?: string;
}
export const listJobs = async (params: ListJobsParams = {}, deps: { jobsService: JobsService }) => {
    return await deps.jobsService.all(params);
};

export const getJob = async (id: string, deps: { jobsService: JobsService }) => {
    return await deps.jobsService.get(id);
};

export const listMinistries = async (deps: { ministriesService: MinistriesService }) => {
    return await deps.ministriesService.listMinistries();
};

export const getMinistry = async (id: string, deps: { ministriesService: MinistriesService }) => {
    return await deps.ministriesService.getMinistry(id);
};
