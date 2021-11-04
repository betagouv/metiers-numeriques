import { v4 } from 'uuid';
import { isError } from '../shared/utils';
import { fakeInstitutions } from './__tests__/stubs/fakeInstitutions';
import { createInstitution, createJob } from './entities';
import { JobsService, InstitutionsService } from './interfaces';
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

export interface AddInstitutionDTO {
    id?: string
    name: string
    description: string
}

export const addInstitution = async (institutionDTO: AddInstitutionDTO, deps: { institutionsService: InstitutionsService }) => {
    const id = institutionDTO.id || v4();
    const institution = createInstitution({
        id,
        name: institutionDTO.name,
        description: institutionDTO.description
    });
    if (isError(institution)) {
        return institution;
    }
    await deps.institutionsService.add(institution);
    return id;
};

export const listInstitutions = async (deps: { institutionsService: InstitutionsService }) => {
    return await deps.institutionsService.all();
};

export const getInstitution = async (id: string, deps: { institutionsService: InstitutionsService }) => {
    return await deps.institutionsService.get(id);
};
