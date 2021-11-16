import { fakeInstitutions } from '../__tests__/stubs/fakeInstitutions';
import { Job } from '../entities';
import { JobsRepositoy } from '../interfaces';
import { JobDetailDTO, JobListDTO } from '../types';

interface InMemory {
    state: Job[];
    feedWith(jobs: Job[]): JobsRepositoy;
}

export const InMemoryJobsService: JobsRepositoy & InMemory = {
    state: [],
    // Write Side
    async add(job: Job): Promise<void> {
        this.state.push(job);
    },

    feedWith(jobs: Job[]): JobsRepositoy {
        for (const job of jobs) {
            job.uuid = (this.state.length + 1).toString();
            this.add(job).then();
        }

        return this;
    },

    async count(): Promise<number> {
        return this.state.length;
    },

    // Read Side
    async list(_params): Promise<{ jobs: JobListDTO; offset: number }> {
        const jobsDetail: JobListDTO = this.state.map(toDTO);

        return { jobs: jobsDetail, offset: 0 };
    },

    async get(jobId: string): Promise<JobDetailDTO | null> {
        return toDTO(this.state.find(j => j.uuid === jobId)!);
    },
};

function toDTO(job: Job) {
    const { uuid, name } = fakeInstitutions.find(i => i.uuid === job.institutionId)!;
    return {
        uuid: job.uuid,
        title: job.title,
        institution: { uuid, name },
        team: job.team,
        availableContracts: job.availableContracts,
        experiences: job.experiences,
        publicationDate: job.publicationDate,
        limitDate: job.limitDate,
        details: {
            mission: job.details.mission,
            team: job.details.team,
            locations: job.details.locations,
            teamInfo: job.details.teamInfo,
            tasks: job.details.tasks,
            profile: job.details.profile,
            salary: job.details.salary,
            hiringProcess: job.details.hiringProcess,
            conditions: job.details.conditions,
            advantages: job.details.advantages,
            more: job.details.more,
            toApply: job.details.toApply,
        },

        updatedAt: job.updatedAt || null,
    };
}
