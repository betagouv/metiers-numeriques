const {Router} = require('express');
const jobController = require('./jobs.controller');

const jobsRoutes = Router()

jobsRoutes.get('/', jobController.list)
jobsRoutes.get('/:id', jobController.get)

module.exports = jobsRoutes
