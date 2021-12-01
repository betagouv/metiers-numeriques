import * as R from 'ramda'

import cache from '../helpers/cache'
import generateJobFromNotionJob from '../helpers/generateJobFromNotionJob'
import generateJobFromNotionPepJob from '../helpers/generateJobFromNotionPepJob'
import handleError from '../helpers/handleError'
import stripHtmlTags from '../helpers/stripHtmlTags'
import Job from '../models/Job'
import notion from '../services/notion'

const sortByPublishedAtDesc: (jobs: Job[]) => Job[] = R.sortWith([R.descend(R.prop('$publishedAt'))])

async function getJobs(req, res) {
  try {
    const cachedResult = await cache.getOrCacheWith(`JOB.ALL`, async () => {
      const notionJobs = await notion.findManyJobs()
      const notionPepJobs = await notion.findManyPepJobs()
      const jobs = notionJobs.map(generateJobFromNotionJob)
      const pepJobs = notionPepJobs.map(generateJobFromNotionPepJob)

      const allJobs = [...jobs, ...pepJobs]
      const allJobsSorted = sortByPublishedAtDesc(allJobs)

      return {
        jobs: allJobsSorted,
        pageDescription:
          'Découvrez l’ensemble des offres d’emploi numériques proposées par les services de l’État ' +
          'et les administrations territoriales.',
        pageTitle: 'Liste des offres d’emploi numériques de l’État',
      }
    })

    const view = req.query.isUpdate ? 'partials/jobList' : 'jobs'

    res.render(view, {
      ...cachedResult,
      helper: {
        stripHtmlTags,
      },
    })
  } catch (err) {
    handleError(err, 'controllers/getJobs()', res)
  }
}

export default getJobs
