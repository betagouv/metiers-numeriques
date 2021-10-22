import { MinistryDetailDTO } from '../../entities';

const fakeMinistries: MinistryDetailDTO[] = [
        {
            id: 'id2',
            description: '<html>1</html>',
        },
        {
            id: 'id2',
            description: '<html>2</html>',
        },
];

const fakeMinistry = fakeMinistries[0];

export {
    fakeMinistries,
    fakeMinistry,
};
