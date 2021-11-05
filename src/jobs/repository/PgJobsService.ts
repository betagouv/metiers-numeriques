import { Knex } from 'knex';
import { InstitutionModel, JobModel } from '../../knex/models';
import { Job } from '../entities';
import { JobsService } from '../interfaces';
import { JobDetailDTO } from '../types';

export const PgJobsServiceFactory = (db: Knex): JobsService => ({
    // Write Side
    async add(job: Job): Promise<void> {
        await db('jobs').insert(jobToDatabase(job));
    },

    async count(): Promise<number> {
        return db('jobs').count();
    },

    // Read Side
    async all(params): Promise<{ jobs: JobDetailDTO[]; offset: number }> {
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
                'institution.uuid',
                'institution.name',
            )
            .from<JobModel | InstitutionModel>('jobs')
            .limit(30)
            .offset(params.offset || 0)
            .join<InstitutionModel>('institutions', 'jobs.institution_id', '=', 'institution.uuid');

        const jobs: JobDetailDTO[] = results.map(r => ({
            uuid: r.uuid,
            availableContracts: JSON.parse(r.available_contracts),
            details: '',
            experiences: JSON.parse(r.experiences),
            institution: {
                uuid: r.institution.uuid,
                name: r.institution.name,
            },
            limitDate: r.limit_date,
            publicationDate: r.publication_date,
            team: r.team,
            title: r.title,
            updatedAt: r.updated_at,

        }));
        return { jobs, offset: params.offset || 0 };
    },

    async get(_jobId: string): Promise<JobDetailDTO | null> {
        return null;
    },
});

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
