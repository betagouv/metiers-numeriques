import { InstitutionDetailDTO } from '../../types';

const fakeInstitutions: InstitutionDetailDTO[] = [
        {
            id: 'institution1',
            description: '<html>1</html>',
            name: 'Institution 1'
        },
        {
            id: 'institution2',
            description: '<html>2</html>',
            name: 'Institution 2'
        },
];

const fakeInstitution = fakeInstitutions[0];

export {
    fakeInstitutions,
    fakeInstitution,
};
