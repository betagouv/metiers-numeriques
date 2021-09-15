'use strict';

require('dotenv').config();
const { fetchPep } = require('./src/schedulers/pepJobsScheduler')

const app = require('./src/server');

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app.listen(port, () => {
  console.log(`${appName} listening at http://localhost:${port}`)
})

