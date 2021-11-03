import { fakeInstitutions } from '../__tests__/stubs/fakeInstitutions';
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
            job.id = (this.state.length + 1).toString()
            await this.add(job);
        }
    },

    async count(): Promise<number> {
        return Promise.resolve(0);
    },

    // Read Side
    async all(_params): Promise<{ jobs: JobDetailDTO[]; offset: number }> {
        const jobsDetail: JobDetailDTO[] = this.state.map(toDTO);

        return Promise.resolve({ jobs: jobsDetail, offset: 0 });
    },

    async get(jobId: string): Promise<JobDetailDTO | null> {
        return toDTO(this.state.find(j => j.id === jobId)!);
    },
};

function toDTO(job: Job) {
    const { id, name } = fakeInstitutions.find(i => i.id === job.institution)!;
    return {
        id: job.id,
        title: job.title,
        institution: { id, name },
        team: job.team,
        availableContracts: job.availableContracts,
        experiences: job.experiences,
        publicationDate: job.publicationDate,
        limitDate: job.limitDate,
        details: job.details,

        updatedAt: job.updatedAt || null,
    };
}
