import { JobDetailDTO } from './entities';

export interface JobsService {
    all(params: any): Promise<{ jobs: JobDetailDTO[]; hasMore: string; nextCursor: string; }>;

    count(): Promise<number>;

    get(pageId: string, tag: string): Promise<JobDetailDTO>;

    getPage(database: string, pageId: string): Promise<any>;

    createPage(database: string, properties: any): Promise<any>;
}

export interface MinistriesService {
    listMinistries(): Promise<any>;

    getMinistry(id: string): Promise<any>;
}
