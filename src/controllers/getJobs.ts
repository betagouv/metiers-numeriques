import handleError from '../helpers/handleError'
import usecases from '../legacy/usecases'
import { dateReadableFormat } from '../legacy/utils'
import notionJob from '../services/notionJob'

async function getJobs(req, res) {
  try {
    const { hasMore, jobs, nextCursor } = await usecases.listJobs(
      {
        jobsRepository: notionJob,
      },
      {
        startCursor: req.query.start_cursor,
      },
    )
    const view = req.query.isUpdate ? 'partials/jobList' : 'jobs'

    res.render(view, {
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
    handleError(err, 'controllers/getJobs()', res)
  }
}

export default getJobs
