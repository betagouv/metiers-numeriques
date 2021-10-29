'use strict';

require('dotenv').config();

const app = require('./src/server');

const port = process.env.APP_PORT || process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
