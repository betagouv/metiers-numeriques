import { fakeMinistries, fakeMinistry } from '../__tests__/stubs/fakeMinistries';
import { MinistriesService } from '../interfaces';

export const InMemoryMinistriesService: MinistriesService = {
    listMinistries(): Promise<any> {
        return Promise.resolve(fakeMinistries);
    },
    getMinistry(id: string): Promise<any> {
        console.log(id)
        return Promise.resolve(fakeMinistry);
    }
};
