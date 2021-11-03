import { v4 } from 'uuid';
import { isError } from '../shared/utils';
import { fakeInstitutions } from './__tests__/stubs/fakeInstitutions';
import { createJob } from './entities';
import { JobsService, MinistriesService } from './interfaces';
import { JobDetailDTO } from './types';

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
export const addJob = async (jobDTO: AddJobDTO, deps: { jobsService: JobsService }): Promise<string | Error> => {
    if (!fakeInstitutions.find(j => j.id === jobDTO.institution)) {
        return new Error('Institution not found')
    }
    const id = jobDTO.id || v4();
    const job = createJob({id, ...jobDTO});
    if (isError(job)) {
        return job;
    }
    await deps.jobsService.add(job);
    return id;
}

interface ListJobsParams {
    offset?: number;
    title?: string;
    institution?: string;
}
export const listJobs = async (params: ListJobsParams = {}, deps: { jobsService: JobsService }) => {
    return await deps.jobsService.all(params);
};

export const getJob = async (id: string, deps: { jobsService: JobsService }): Promise<JobDetailDTO | null> => {
    return await deps.jobsService.get(id);
};

export const listMinistries = async (deps: { ministriesService: MinistriesService }) => {
    return await deps.ministriesService.listMinistries();
};

export const getMinistry = async (id: string, deps: { ministriesService: MinistriesService }) => {
    return await deps.ministriesService.getMinistry(id);
};
