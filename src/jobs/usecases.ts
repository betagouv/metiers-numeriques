import { v4 } from 'uuid';
import { isError } from '../shared/utils';
import { UuidGenerator } from '../shared/uuidGenerator';
import { fakeInstitutions } from './__tests__/stubs/fakeInstitutions';
import { createInstitution, createJob } from './entities';
import { InstitutionsRepository, JobsRepositoy } from './interfaces';
import { JobDetailDTO, JobElementsDTO } from './types';

export interface AddJobDTO {
    title: string;
    institutionId: string;
    team: string;
    availableContracts: string[]
    experiences: string[]
    publicationDate: string
    limitDate: string | null
    details: JobElementsDTO
}
export const addJob = async (jobDTO: AddJobDTO, deps: { jobsService: JobsRepositoy, uuidGenerator: UuidGenerator }): Promise<string | Error> => {
    if (!fakeInstitutions.find(j => j.uuid === jobDTO.institutionId)) {
        return new Error('Institution not found')
    }
    const uuid = deps.uuidGenerator();
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
export const listJobs = async (params: ListJobsParams = {}, deps: { jobsService: JobsRepositoy }) => {
    return await deps.jobsService.list(params);
};

export const getJob = async (uuid: string, deps: { jobsService: JobsRepositoy }): Promise<JobDetailDTO | null> => {
    return await deps.jobsService.get(uuid);
};

export interface AddInstitutionDTO {
    uuid?: string
    name: string
    description: string
}

export const addInstitution = async (institutionDTO: AddInstitutionDTO, deps: { institutionsService: InstitutionsRepository }) => {
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

export const listInstitutions = async (deps: { institutionsService: InstitutionsRepository }) => {
    return await deps.institutionsService.list();
};

export const getInstitution = async (uuid: string, deps: { institutionsService: InstitutionsRepository }) => {
    return await deps.institutionsService.get(uuid);
};
