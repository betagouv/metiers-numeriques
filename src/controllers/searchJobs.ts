import Fuse from 'fuse.js'
import * as R from 'ramda'

import cache from '../helpers/cache'
import generateJobFromNotionJob from '../helpers/generateJobFromNotionJob'
import generateJobFromNotionPepJob from '../helpers/generateJobFromNotionPepJob'
import handleError from '../helpers/handleError'
import stripHtmlTags from '../helpers/stripHtmlTags'
import Job from '../models/Job'
import notion from '../services/notion'

const sortByPublishedAtDesc: (jobs: Job[]) => Job[] = R.sortWith([R.descend(R.prop('$publishedAt'))])

const getCachedJobsIndex = async () =>
  cache.getOrCacheWith('JOBS.SEARCH_INDEX', async () => {
    const notionJobs = await notion.findManyJobs()
    const notionPepJobs = await notion.findManyPepJobs()
    const jobs = notionJobs.map(generateJobFromNotionJob)
    const pepJobs = notionPepJobs.map(generateJobFromNotionPepJob)

    const allJobsIndex = [...jobs, ...pepJobs]
    const allJobsSortedIndex = sortByPublishedAtDesc(allJobsIndex)

    return allJobsSortedIndex
  })

const searchJobs = async (req, res) => {
  try {
    const jobsIndex = await getCachedJobsIndex()
    const fusedJobs = new Fuse(jobsIndex, {
      includeScore: true,
      keys: ['title'],
    })
    const foundJobs = fusedJobs
      .search(req.query.query)
      .filter(({ score }) => score !== undefined && score < 0.75)
      .map(({ item }) => item)

    res.render('partials/jobList', {
      hasMore: false,
      helper: {
        stripHtmlTags,
      },
      jobs: foundJobs,
      nextCursor: req.query.nextCursor,
    })
  } catch (err) {
    handleError(err, 'controllers/searchJobs()', res)
  }
}

export default searchJobs
