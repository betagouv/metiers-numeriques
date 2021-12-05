import express from 'express'
import path from 'path'

import getInstitution from './controllers/getInstitution'
import getInstitutions from './controllers/getInstitutions'
import getJob from './controllers/getJob'
import getJobs from './controllers/getJobs'
import searchJobs from './controllers/searchJobs'

const appName = `metiers.numerique.gouv.fr`
const appDescription = 'Tout savoir sur les métiers du numérique au sein de l’État.'
const appContactEmail = 'contact@metiers.numerique.gouv.fr'
const appRepo = 'https://github.com/betagouv/metiers-numeriques'
const appRoot = path.resolve(__dirname)

const server = express()

server.set('view engine', 'ejs')
server.set('views', path.join(__dirname, '../views'))

server.use('/static', express.static(path.join(__dirname, '../static')))
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
server.get('/institutions', getInstitutions)
server.get('/institution/:slug', getInstitution)

server.get('/annonces/:slug', (req, res) => {
  res.redirect(301, `/emploi/${req.params.slug}`)
})
server.get('/annonces', (req, res) => {
  res.redirect(301, `/emplois`)
})

server.use((req, res) => {
  res.status(404).render('404')
})

export default server
