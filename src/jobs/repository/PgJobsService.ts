import { Job } from '../entities';
import { JobsService } from '../interfaces';
import { JobDetailDTO } from '../types';

export const PgJobsService: JobsService = {
    // Write Side
    add(job: Job): Promise<void> {
        return Promise.resolve(undefined);
    },

    count(): Promise<number> {
        return Promise.resolve(0);
    },

    // Read Side
    all(params: any): Promise<{ jobs: JobDetailDTO[]; hasMore: string; nextCursor: string }> {
        return Promise.resolve({ hasMore: '', jobs: [], nextCursor: '' });
    },

    get(jobId: string): Promise<JobDetailDTO | null> {
        return Promise.resolve(undefined);
    }
}
