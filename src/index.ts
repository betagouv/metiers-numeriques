import ß from 'bhala'
import express from 'express'
import next from 'next'
import path from 'path'

import getInstitution from './controllers/getInstitution'
import getInstitutions from './controllers/getInstitutions'
import getJob from './controllers/getJob'
import getJobs from './controllers/getJobs'
import searchJobs from './controllers/searchJobs'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 8080

const appName = `metiers.numerique.gouv.fr`
const appDescription = 'Tout savoir sur les métiers du numérique au sein de l’État.'
const appContactEmail = 'contact@metiers.numerique.gouv.fr'
const appRepo = 'https://github.com/betagouv/metiers-numeriques'

const app = next({
  dev: !IS_PRODUCTION,
})
const handle = app.getRequestHandler()
const server = express()

app.prepare().then(() => {
  server.set('view engine', 'ejs')
  server.set('views', path.join(__dirname, '../views'))

  // Populate some variables for all views
  server.use((req, res, next) => {
    res.locals.appContactEmail = appContactEmail
    res.locals.appDescription = appDescription
    res.locals.appName = appName
    res.locals.appRepo = appRepo
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
    res.render('legalNotices', {
      pageDescription: '',
      pageTitle: 'Mentions légales',
    })
  })

  server.get('/donnees-personnelles-et-cookies', (req, res) => {
    res.render('privacy', {
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

  server.all('*', (req, res) => handle(req, res))

  server.listen(PORT, () => {
    ß.info(`Server listening at http://localhost:${PORT}.`)
  })
})
