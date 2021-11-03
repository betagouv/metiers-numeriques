import { fakeInstitutions, fakeInstitution } from '../__tests__/stubs/fakeInstitutions';
import { MinistriesService } from '../interfaces';

export const InMemoryMinistriesService: MinistriesService = {
    listMinistries(): Promise<any> {
        return Promise.resolve(fakeInstitutions);
    },
    getMinistry(id: string): Promise<any> {
        console.log(id)
        return Promise.resolve(fakeInstitution);
    }
};
