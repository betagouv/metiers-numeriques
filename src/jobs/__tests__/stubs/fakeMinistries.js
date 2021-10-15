'use strict';

const Ministry = require('../../entities');

const fakeMinistries = [
    new Ministry(
        {
            id: 'id2',
            description: '<html>1</html>'
        }),
    new Ministry(
        {
            id: 'id2',
            description: '<html>2</html>'
        })
];

const fakeMinistry = fakeMinistries[0];

module.exports = {
    fakeMinistries,
    fakeMinistry
};
