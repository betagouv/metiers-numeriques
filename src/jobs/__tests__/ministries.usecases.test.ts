import { InMemoryMinistriesService } from '../infrastructure/inMemoryMinistriesService';
import * as usecases from '../usecases';

describe('Ministries managmenent', () => {
    let ministriesService: typeof InMemoryMinistriesService;

    beforeEach(() => {
        ministriesService = InMemoryMinistriesService;
    })

    it('should get the ministries list', async () => {
        const result = await usecases.listMinistries({ ministriesService });

        expect(result).toEqual([
                {
                    id: 'id2',
                    description: '<html>1</html>',
                },
                {
                    id: 'id2',
                    description: '<html>2</html>',
                },
        ]);
    });

    // it('should get one job detail', async () => {
    //     const jobsRepository = {
    //         get: () => fakeJob
    //     };
    //
    //     const result = await usecases.getJob(fakeJob.title, {jobsRepository});
    //
    //     expect(result).toEqual(new Job(
    //         {
    //             id: 'id2',
    //             title: 'job2',
    //             mission: 'mon job 2',
    //             experiences: ['5 ans'],
    //             locations: ['Paris'],
    //             department: ['Ministère des armées'],
    //             openedToContractTypes: ['CDD', 'CDI'],
    //             salary: '50k',
    //             team: 'MTES',
    //             profile: '',
    //             tasks: []
    //         }));
    // });
});
