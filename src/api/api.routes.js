const { Router } = require('express')

const apiController = require('./api.controller')

const apiRoutes = Router()
apiRoutes.get('/api/jobs/search/:query', apiController.jobs.search)

module.exports = apiRoutes
