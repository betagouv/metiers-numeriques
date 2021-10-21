'use strict';

require('dotenv').config();

const app = require('./server');

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
