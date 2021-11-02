import { Job, UUID } from './entities';
import { JobDetailDTO } from './types';

export interface JobsService {
    add(job: Job): Promise<void>;
    count(): Promise<number>;
    all(params: any): Promise<{ jobs: JobDetailDTO[]; hasMore: string; nextCursor: string; }>;
    get(jobId: UUID): Promise<JobDetailDTO | null>;
}

export interface MinistriesService {
    listMinistries(): Promise<any>;
    getMinistry(id: string): Promise<any>;
}
