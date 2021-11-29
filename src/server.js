const express = require('express')
const path = require('path')

const getJob = require('./controllers/getJob')
const getJobs = require('./controllers/getJobs')
const getMinistries = require('./controllers/getMinistries')
const getMinistry = require('./controllers/getMinistry')
const searchJobs = require('./controllers/searchJobs')

const appName = `metiers.numerique.gouv.fr`
const appDescription = 'Tout savoir sur les métiers du numérique au sein de l’État.'
const appContactEmail = 'contact@metiers.numerique.gouv.fr'
const appRepo = 'https://github.com/betagouv/metiers-numeriques'
const appRoot = path.resolve(__dirname)

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))

// app.use('/static', express.static('../static'));
app.use('/static', express.static(path.join(__dirname, '../static')))
// Hack for importing css from npm package
app.use('/~', express.static(path.join(__dirname, '../node_modules')))
// Populate some variables for all views
app.use((req, res, next) => {
  res.locals.appName = appName
  res.locals.appDescription = appDescription
  res.locals.appContactEmail = appContactEmail
  res.locals.appRepo = appRepo
  res.locals.page = req.url
  res.locals.appRoot = appRoot
  next()
})

app.get('/', (req, res) => {
  res.render('landing', {
    pageDescription: appDescription,
    pageTitle: 'Découvrez les métiers numériques de l’État',
  })
})

app.get('/mentions-legales', (req, res) => {
  res.render('legalNotice', {
    pageDescription: '',
    pageTitle: 'Mentions légales',
  })
})

app.get('/suivi', (req, res) => {
  res.render('suivi', {
    pageDescription: '',
    pageTitle: 'Données personnelles et cookies',
  })
})

app.get('/annonces', getJobs)
app.get('/annonces/:id', getJob)
app.get('/jobs/search', searchJobs)
app.get('/ministeres', getMinistries)
app.get('/ministeres/:id', getMinistry)

app.use((req, res) => {
  res.status(404).end()
})

module.exports = app