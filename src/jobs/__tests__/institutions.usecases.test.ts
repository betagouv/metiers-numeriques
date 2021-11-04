import { createInstitution, Institution } from '../entities';
import { InMemoryInstitutionsService } from '../repository/inMemoryInstitutionService';
import * as usecases from '../usecases';
import { AddInstitutionDTO } from '../usecases';
import { fakeInstitutions } from './stubs/fakeInstitutions';

describe('Institution display', () => {
    let institutionsService: typeof InMemoryInstitutionsService = InMemoryInstitutionsService;

    beforeEach(() => {
        institutionsService.state = [];
    })

    it('should get the institutions list', async () => {
        await institutionsService.feedWith(fakeInstitutions)
        const result = await usecases.listInstitutions({ institutionsService });

        expect(result).toEqual([
                {
                    id: 'institution1',
                    name: 'Institution 1',
                    description: '<html>1</html>',
                },
                {
                    id: 'institution2',
                    name: 'Institution 2',
                    description: '<html>2</html>',
                },
        ]);
    });

    it('should get one institution detail', async () => {
        await institutionsService.feedWith(fakeInstitutions)
        const result = await usecases.getInstitution(fakeInstitutions[0].id, {institutionsService});

        expect(result).toEqual(
            {
                id: 'institution1',
                name: 'Institution 1',
                description: '<html>1</html>',
            });
    });
});

describe('Creating institution', () => {
    let institutionsService: typeof InMemoryInstitutionsService = InMemoryInstitutionsService;

    beforeEach(() => {
        institutionsService.state = [];
    });

    it('should create an institution with required data', async () => {
        const institutionDTO: AddInstitutionDTO = {
            id: 'institution3',
            name: 'Institution 3',
            description: '<html>3</html>',
        };

        await usecases.addInstitution(institutionDTO, {institutionsService});

        expect(institutionsService.state[0]).toEqual(
            createInstitution(
                {
                    id: 'institution3',
                    name: 'Institution 3',
                    description: '<html>3</html>',
                }) as Institution);
    })

    it('should error when creating an institution with insufficient data', async () => {
        // @ts-ignore
        const institutionDTO: AddInstitutionDTO = {
            id: 'institution3',
            // name: 'Institution 3',
            description: '<html>3</html>',
        };

        const result = await usecases.addInstitution(institutionDTO, {institutionsService}) as Error;
        await expect(result).toBeInstanceOf(Error);
        await expect(result.message).toEqual('Missing fields');
    })
});

