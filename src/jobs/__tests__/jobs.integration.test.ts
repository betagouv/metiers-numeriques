import knex, { Knex } from 'knex';
import path from 'path';
import { DockerComposeEnvironment } from 'testcontainers';
import { StartedDockerComposeEnvironment } from 'testcontainers/dist/docker-compose-environment/started-docker-compose-environment';
import { JobModel } from '../../knex/models';
import config from '../../knexfile';
import { UuidGenerator, uuidGeneratorFactory } from '../../shared/uuidGenerator';
import { JobsRepositoy } from '../interfaces';
import { PgJobsRepository } from '../repository/PgJobsRepository';
import { fakeJobs } from './stubs/fakeJobs';

describe('Jobs database', () => {
    let database: Knex;
    let environment: StartedDockerComposeEnvironment;
    let jobsService: JobsRepositoy;
    let uuidGenerator: UuidGenerator;

    beforeAll(async () => {
        const composeFilePath = path.resolve(__dirname, '../../../');
        const composeFile = 'docker-compose.yml';

        environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
            .withEnv('POSTGRES_USER', 'metiersnum')
            .withEnv('POSTGRES_PASSWORD', 'metiersnum')
            .withEnv('POSTGRES_DB', 'metiersnumtest')
            .withEnv('EXPOSED_PORT', '5433')
            .up();
        database = knex(config.test);
        await database.migrate.latest();
    });

    beforeEach(async () => {
        jobsService = PgJobsRepository(database);
        uuidGenerator = uuidGeneratorFactory('407ccaa8-9812-4abe-a8b3-fc88e5b1b993');
    });

    afterEach(async () => {
        database.raw('delete from jobs')
    });

    afterAll(async () => {
        await environment.down();
        await database.destroy();
    });

    it('should save a job', async () => {
        const job = {
            ...fakeJobs[0],
            uuid: uuidGenerator(),
            institutionId: uuidGenerator(),
        };
        await jobsService.add(job);
        const result = await database<JobModel>('jobs').where('title', 'job1').first();
        expect(result!.uuid).toEqual(uuidGenerator());
    });


    it.skip('should get the job list', async () => {
        const job = {
            ...fakeJobs[0],
            uuid: uuidGenerator(),
            institutionId: uuidGenerator(),
        };
        await jobsService.add(job);
        await jobsService.add(job);

        const result = await jobsService.list({});
        console.log(result)
        expect(result.jobs.length).toEqual(2);
    });

    it.skip('should get one job detail', async () => {
        const result = await jobsService.get('uuid');
        expect(result).toBeDefined();
    });
});
