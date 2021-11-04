import { Institution, Job, UUID } from './entities';
import { InstitutionDetailDTO, JobDetailDTO } from './types';

export interface JobsService {
    add(job: Job): Promise<void>;
    count(): Promise<number>;
    all(params: {offset?: number; title?: string; institution?: string; }): Promise<{ jobs: JobDetailDTO[]; offset: number }>;
    get(jobId: UUID): Promise<JobDetailDTO | null>;
}

export interface InstitutionsService {
    add(institution: Institution): Promise<void>;
    count(): Promise<number>;
    all(): Promise<InstitutionDetailDTO[]>;
    get(institutionId: UUID): Promise<InstitutionDetailDTO | null>;
}
