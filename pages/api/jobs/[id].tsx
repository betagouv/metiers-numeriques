import { ApiEndpoint } from '@api/libs/endpoint'
import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'

const getJob = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  try {
    const data = await prisma.job.findUnique({
      where: { id: id as string },
    })

    res.send(data)
  } catch (err) {
    handleError(err, 'pages/api/jobs/[id].ts > query.getJob()')
    res.status(400).send([])
  }
}

export default ApiEndpoint({
  GET: {
    handler: getJob,
  },
})
