import { fakeJob, fakeJobs } from '../__tests__/stubs/fakeJobs';
import { JobsService } from '../interfaces';


export class InMemoryJobsService implements JobsService {
    jobs: Job[] = [];

    async all(_params = {}) {
        return {
            jobs: fakeJobs,
            hasMore: '',
            nextCursor: '',
        };
    }

    async get(_id: string) {
        return fakeJob;
    }

    count(): Promise<number> {
        return Promise.resolve(0);
    }

    async addJob(job: Job): Promise<void> {
        this.jobs.push(job);
    }

    createPage(_database: string, _properties: any): Promise<any> {
        return Promise.resolve(undefined);
    }

    getPage(_database: string, _pageId: string): Promise<any> {
        return Promise.resolve(undefined);
    }
}
