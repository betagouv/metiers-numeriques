'use strict';

const { MinistryDetailDTO } = require('../../entities');

const fakeMinistries = [
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
];

const fakeMinistry = fakeMinistries[0];

module.exports = {
    fakeMinistries,
    fakeMinistry,
};
