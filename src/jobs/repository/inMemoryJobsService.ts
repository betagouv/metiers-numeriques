import { Job } from '../entities';
import { JobsService } from '../interfaces';
import { JobDetailDTO } from '../types';

interface InMemory {
    state: Job[];
    feedWith(jobs: Job[]): void;
}

export const InMemoryJobsService: JobsService & InMemory = {
    state: [],
    // Write Side
    async add(job: Job): Promise<void> {
        this.state.push(job);
    },

    async feedWith(jobs: Job[]): Promise<void> {
        for (const job of jobs) {
            await this.add(job);
        }
    },

    async count(): Promise<number> {
        return Promise.resolve(0);
    },

    // Read Side
    async all(_query: any): Promise<{ jobs: JobDetailDTO[]; hasMore: string; nextCursor: string }> {
        return Promise.resolve({ hasMore: '', jobs: [], nextCursor: '' });
    },

    async get(_jobId: string): Promise<JobDetailDTO | null> {
        return Promise.resolve(null);
    }
}
