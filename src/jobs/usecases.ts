import { v4 } from 'uuid';
import { isError } from '../shared/utils';
import { fakeInstitutions } from './__tests__/stubs/fakeInstitutions';
import { createInstitution, createJob } from './entities';
import { JobsService, InstitutionsService } from './interfaces';
import { JobDetailDTO } from './types';

export interface AddJobDTO {
    uuid?: string
    title: string;
    institutionId: string;
    team: string;
    availableContracts: string[]
    experiences: string[]
    publicationDate: string
    limitDate: string | null
    details: string
}
export const addJob = async (jobDTO: AddJobDTO, deps: { jobsService: JobsService }): Promise<string | Error> => {
    if (!fakeInstitutions.find(j => j.uuid === jobDTO.institutionId)) {
        return new Error('Institution not found')
    }
    const uuid = jobDTO.uuid || v4();
    const job = createJob({uuid, ...jobDTO});
    if (isError(job)) {
        return job;
    }
    await deps.jobsService.add(job);
    return uuid;
}

interface ListJobsParams {
    offset?: number;
    title?: string;
    institution?: string;
}
export const listJobs = async (params: ListJobsParams = {}, deps: { jobsService: JobsService }) => {
    return await deps.jobsService.all(params);
};

export const getJob = async (uuid: string, deps: { jobsService: JobsService }): Promise<JobDetailDTO | null> => {
    return await deps.jobsService.get(uuid);
};

export interface AddInstitutionDTO {
    uuid?: string
    name: string
    description: string
}

export const addInstitution = async (institutionDTO: AddInstitutionDTO, deps: { institutionsService: InstitutionsService }) => {
    const uuid = institutionDTO.uuid || v4();
    const institution = createInstitution({
        uuid,
        name: institutionDTO.name,
        description: institutionDTO.description
    });
    if (isError(institution)) {
        return institution;
    }
    await deps.institutionsService.add(institution);
    return uuid;
};

export const listInstitutions = async (deps: { institutionsService: InstitutionsService }) => {
    return await deps.institutionsService.all();
};

export const getInstitution = async (uuid: string, deps: { institutionsService: InstitutionsService }) => {
    return await deps.institutionsService.get(uuid);
};
