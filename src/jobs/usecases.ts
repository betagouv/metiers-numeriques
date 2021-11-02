import { createJob } from './entities';
import { JobsService, MinistriesService } from './interfaces';

interface AddJobDTO {
    title: string;
    institution: string;
    team: string;
    availableContracts: string[]
    experiences: string[]
    publicationDate: string
    limitDate: string
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

export const listJobs = async (params: any = null, deps: { jobsService: JobsService }) => {
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
