import { Job, UUID } from './entities';
import { JobDetailDTO } from './types';

export interface JobsService {
    add(job: Job): Promise<void>;
    count(): Promise<number>;
    all(params: {offset?: number; title?: string; institution?: string; }): Promise<{ jobs: JobDetailDTO[]; offset: number }>;
    get(jobId: UUID): Promise<JobDetailDTO | null>;
}

export interface MinistriesService {
    listMinistries(): Promise<any>;
    getMinistry(id: string): Promise<any>;
}
