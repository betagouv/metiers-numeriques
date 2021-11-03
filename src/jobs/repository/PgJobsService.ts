import { Job } from '../entities';
import { JobsService } from '../interfaces';
import { JobDetailDTO } from '../types';

export const PgJobsService: JobsService = {
    // Write Side
    async add(_job: Job): Promise<void> {
        return;
    },

    async count(): Promise<number> {
        return Promise.resolve(0);
    },

    // Read Side
    async all(params): Promise<{ jobs: JobDetailDTO[]; offset: number }> {
        return Promise.resolve({ jobs: [], offset: params.offset! });
    },

    async get(_jobId: string): Promise<JobDetailDTO | null> {
        return null;
    }
}
