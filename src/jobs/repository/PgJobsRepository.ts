import { Knex } from 'knex';
import { InstitutionModel, JobModel } from '../../knex/models';
import { Job } from '../entities';
import { JobsRepositoy } from '../interfaces';
import { JobDetailDTO, JobListDTO } from '../types';

export const PgJobsRepository = (db: Knex): JobsRepositoy => ({
    // Write Side
    async add(job: Job): Promise<void> {
        await db('jobs').insert(jobToDatabase(job));
    },

    async count(): Promise<number> {
        return db('jobs').count();
    },

    // Read Side
    async list(params): Promise<{ jobs: JobListDTO; offset: number }> {
        const results = await db
            .select(
                'jobs.uuid',
                'jobs.title',
                'jobs.team',
                'jobs.available_contracts',
                'jobs.experiences',
                'jobs.publication_date',
                'jobs.limit_date',
                'jobs.updated_at',
                // 'institutions.uuid',
                // 'institutions.name',
            )
            .from<JobModel>('jobs')
            .join<InstitutionModel>('institutions', 'jobs.institution_id', '=', 'institutions.uuid');
        // .limit(30)
        // .offset(params.offset || 0);

        const jobs: JobListDTO = results.map(toDTO);
        return { jobs, offset: params.offset || 0 };
    },

    async get(_jobId: string): Promise<JobDetailDTO | null> {
        const result = await db
            .select(
                'jobs.uuid',
                'jobs.title',
                'jobs.team',
                'jobs.available_contracts',
                'jobs.experiences',
                'jobs.publication_date',
                'jobs.limit_date',
                'jobs.updated_at',
                'institutions.uuid',
                'institutions.name',
            )
            .from<JobModel | InstitutionModel>('jobs')
            .join<InstitutionModel>('institutions', 'jobs.institution_id', '=', 'institutions.uuid')
            .first();

        if (!result) {
            return null;
        }

        return toDTO(result);
    },
});


function toDTO(raw: any): JobDetailDTO {
    return {
        uuid: raw.uuid,
        availableContracts: JSON.parse(raw.available_contracts),
        details: {
            team: raw.team,
            teamInfo: raw.teamInfo,
            mission: raw.mission,
            locations: raw.locations,
            tasks: raw.tasks,
            profile: raw.profile,
            salary: raw.salary,
            hiringProcess: raw.hiringProcess,
            conditions: raw.conditions,
            advantages: raw.advantages,
            more: raw.more,
            toApply: raw.toApply,
        },
        experiences: JSON.parse(raw.experiences),
        institution: {
            uuid: raw.institutions.uuid,
            name: raw.institutions.name,
        },
        limitDate: raw.limit_date,
        publicationDate: raw.publication_date,
        team: raw.team,
        title: raw.title,
        updatedAt: raw.updated_at,
    };
}

function jobToDatabase(job: Job): JobModel {
    return {
        uuid: job.uuid,
        institution_id: job.institutionId,
        title: job.title,
        team: job.team,
        available_contracts: JSON.stringify(job.availableContracts),
        experiences: JSON.stringify(job.experiences),
        publication_date: new Date(job.publicationDate),
        limit_date: job.limitDate ? new Date(job.limitDate) : null,
        created_at: new Date(),
        updated_at: null,
    };
}
