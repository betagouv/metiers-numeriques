import express from 'express'
import path from 'path'

import getJob from './controllers/getJob'
import getJobs from './controllers/getJobs'
import getMinistries from './controllers/getMinistries'
import getMinistry from './controllers/getMinistry'
import searchJobs from './controllers/searchJobs'

const appName = `metiers.numerique.gouv.fr`
const appDescription = 'Tout savoir sur les métiers du numérique au sein de l’État.'
const appContactEmail = 'contact@metiers.numerique.gouv.fr'
const appRepo = 'https://github.com/betagouv/metiers-numeriques'
const appRoot = path.resolve(__dirname)

const server = express()

server.set('view engine', 'ejs')
server.set('views', path.join(__dirname, '../views'))

// server.use('/static', express.static('../static'));
server.use('/static', express.static(path.join(__dirname, '../static')))
// Hack for importing css from npm package
server.use('/~', express.static(path.join(__dirname, '../node_modules')))
// Populate some variables for all views
server.use((req, res, next) => {
  res.locals.appContactEmail = appContactEmail
  res.locals.appDescription = appDescription
  res.locals.appName = appName
  res.locals.appRepo = appRepo
  res.locals.appRoot = appRoot
  res.locals.selectedMenu = ''

  next()
})

server.get('/', (req, res) => {
  res.render('landing', {
    pageDescription: appDescription,
    pageTitle: 'Découvrez les métiers numériques de l’État',
    selectedMenu: 'home',
  })
})

server.get('/mentions-legales', (req, res) => {
  res.render('legalNotice', {
    pageDescription: '',
    pageTitle: 'Mentions légales',
  })
})

server.get('/suivi', (req, res) => {
  res.render('suivi', {
    pageDescription: '',
    pageTitle: 'Données personnelles et cookies',
  })
})

server.get('/emplois', getJobs)
server.get('/emploi/:slug', getJob)
server.get('/jobs/search', searchJobs)
server.get('/institutions', getMinistries)
server.get('/institution/:slug', getMinistry)

server.use((req, res) => {
  res.status(404).end()
})

export default server
