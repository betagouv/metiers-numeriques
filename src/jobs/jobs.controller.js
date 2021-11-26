const uncapitalizeFirstLetter = require('../helpers/uncapitalizeFirstLetter')
const search = require('./controllers/search')
const { jobsRepository, ministriesRepository } = require('./dependencies')
const usecases = require('./usecases')
const { dateReadableFormat } = require('./utils')

module.exports.get = async (req, res) => {
  const id = req.url.split('-').slice(-5).join('-').split('?')[0]
  const { tag } = req.query
  const job = await usecases.getJob(id, { jobsRepository }, tag)

  res.render('jobDetail', {
    contactEmail: 'contact@metiers.numerique.gouv.fr',
    dateReadableFormat,
    job,
    pageDescription: job.mission || '',
    pageTitle: job.title,
  })
}

module.exports.getMinistry = async (req, res) => {
  const ministry = await usecases.getMinistry(req.params.id, { ministriesRepository })

  res.render('ministryDetail', {
    contactEmail: 'contact@metiers.numerique.gouv.fr',
    ministry,
    pageDescription: `Tout savoir sur ${uncapitalizeFirstLetter(ministry.fullName)}.`,
    pageTitle: ministry.title,
  })
}

module.exports.list = async (req, res) => {
  try {
    const { hasMore, jobs, nextCursor } = await usecases.listJobs(
      {
        jobsRepository,
      },
      {
        startCursor: req.query.start_cursor,
      },
    )
    const view = req.query.isUpdate ? 'partials/jobList' : 'jobs'

    res.render(view, {
      contactEmail: 'contact@metiers.numerique.gouv.fr',
      dateReadableFormat,
      hasMore,
      jobs,
      nextCursor,
      pageDescription:
        'Découvrez l’ensemble des offres d’emploi numériques proposées par les services de l’État ' +
        'et les administrations territoriales.',
      pageTitle: 'Liste des offres d’emploi numériques de l’État',
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports.listMinistries = async (req, res) => {
  try {
    const { ministries, nextCursor } = await usecases.listMinistries(
      {
        ministriesRepository,
      },
      {
        startCursor: req.query.start_cursor,
      },
    )

    res.render('ministries', {
      contactEmail: 'contact@metiers.numerique.gouv.fr',
      ministries,
      nextCursor,
      pageDescription: 'Découvrez l’ensemble des entités numériques des ministères et services de l’État.',
      pageTitle: 'Liste des entités numériques de l’État',
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports.search = search
