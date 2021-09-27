'use strict';

const axios = require('axios');
const app = require('../src/server');
require('dotenv').config();

describe('Displaying jobs on website', () => {
    const port = 8888;
    let server = null;

    beforeEach( () => {
        const port = 8888;

        server = app.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}`);
        });
    });

    afterEach(function () {
        server.close();
    });

    it('should display the list of jobs', async () => {
        const response = await axios.get(`http://localhost:${port}/annonces`);
        expect(response.status).toEqual(200)
        expect(response.data).toContain('<html')
    })
})
