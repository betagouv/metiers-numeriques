import { Institution, Job, UUID } from './entities';
import { InstitutionDetailDTO, JobDetailDTO, JobListDTO } from './types';

export interface JobsRepositoy {
    add(job: Job): Promise<void>;
    count(): Promise<number>;
    list(params: {offset?: number; title?: string; institution?: string; }): Promise<{ jobs: JobListDTO; offset: number }>;
    get(jobId: UUID): Promise<JobDetailDTO | null>;
}

export interface InstitutionsRepository {
    add(institution: Institution): Promise<void>;
    count(): Promise<number>;
    list(): Promise<InstitutionDetailDTO[]>;
    get(institutionId: UUID): Promise<InstitutionDetailDTO | null>;
}
