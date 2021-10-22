import axios from 'axios';
import http from 'http';
import { config } from 'dotenv';
config();

import app from '../server';

describe('Displaying jobs on website', () => {
    const port = 8888;
    let server: http.Server;

    beforeEach(() => {
        const port = 8888;

        server = app.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}`);
        });
    });

    afterEach(function() {
        server.close();
    });

    it('should display the list of jobs', async () => {
        const response = await axios.get(`http://localhost:${port}/annonces`);
        expect(response.status).toEqual(200);
        expect(response.data).toContain('<html');
    });
});
