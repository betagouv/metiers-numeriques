import { fakeJob, fakeJobs } from '../__tests__/stubs/fakeJobs';
import { JobsService } from '../types';

export const InMemoryJobsService: JobsService = {
    async all(_params = {}) {
        return {
            jobs: fakeJobs,
            hasMore: '',
            nextCursor: ''
        };
    },

    async get(_id) {
        return fakeJob;
    },
    count(): Promise<number> {
        return Promise.resolve(0);
    },
    createPage(_database: string, _properties: any): Promise<any> {
        return Promise.resolve(undefined);
    },
    getPage(_database: string, _pageId: string): Promise<any> {
        return Promise.resolve(undefined);
    },
};
