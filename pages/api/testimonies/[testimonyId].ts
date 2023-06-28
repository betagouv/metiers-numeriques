import { ApiEndpoint } from '@api/libs/endpoint'
import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'

const getTestimony = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { testimonyId } = req.query
    const data = await prisma.testimony.findUnique({
      include: { avatarFile: true },
      where: { id: testimonyId as string },
    })

    if (!data) {
      res.status(404).send({})
    } else {
      res.send(data)
    }
  } catch (err) {
    handleError(err, 'pages/api/testimonies/[testimonyId].ts > query.getTestimony()')
    res.status(400).send({})
  }
}

const updateTestimony = async (req: NextApiRequest, res: NextApiResponse) => {
  const { testimonyId } = req.query

  const data = JSON.parse(req.body)
  try {
    const updateResponse = await prisma.testimony.update({ data, where: { id: testimonyId as string } })
    res.status(200).send(updateResponse)
  } catch (err) {
    handleError(err, 'pages/api/testimonies/[testimonyId].ts > query.updateTestimony()')
    res.status(400).end()
  }
}

export default ApiEndpoint({
  GET: {
    handler: getTestimony,
    permission: 'ADMINISTRATOR',
  },
  PUT: {
    handler: updateTestimony,
    permission: 'ADMINISTRATOR',
  },
})
