const usecases = require('../usecases');
const { MinistryDetailDTO } = require('../entities');
const { fakeMinistries } = require('./stubs/fakeMinistries');

describe('Ministries managmenent', () => {
    it('should get the ministries list', async () => {
        const ministriesRepository = {
            listMinistries: () => fakeMinistries,
        };

        const result = await usecases.listMinistries({ ministriesRepository });

        expect(result).toEqual([
            new MinistryDetailDTO(
                {
                    id: 'id2',
                    description: '<html>1</html>',
                }),
            new MinistryDetailDTO(
                {
                    id: 'id2',
                    description: '<html>2</html>',
                }),
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
