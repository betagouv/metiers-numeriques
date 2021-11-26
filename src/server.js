const express = require('express')
const path = require('path')

const { jobRoutes } = require('./jobs')

const appName = `metiers.numerique.gouv.fr`
const appDescription = 'Tout savoir sur les métiers du numérique au sein de l’État.'
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
  res.locals.appRepo = appRepo
  res.locals.page = req.url
  res.locals.appRoot = appRoot
  next()
})

app.get('/', (req, res) => {
  res.render('landing', {
    contactEmail: 'contact@metiers.numerique.gouv.fr',
    pageDescription: appDescription,
    pageTitle: 'Découvrez les métiers numériques de l’État',
  })
})

app.get('/mentions-legales', (req, res) => {
  res.render('legalNotice', {
    contactEmail: 'contact@metiers.numerique.gouv.fr',
    pageDescription: '',
    pageTitle: 'Mentions légales',
  })
})

app.get('/suivi', (req, res) => {
  res.render('suivi', {
    contactEmail: 'contact@metiers.numerique.gouv.fr',
    pageDescription: '',
    pageTitle: 'Données personnelles et cookies',
  })
})

app.use('/', jobRoutes)
app.use((req, res) => {
  res.status(404).end()
})

module.exports = app
