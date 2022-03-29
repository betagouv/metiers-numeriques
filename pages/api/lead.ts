import getPrisma from '@api/helpers/getPrisma'
import ApiError from '@api/libs/ApiError'
import handleError from '@common/helpers/handleError'
import mailchimpMarketing from '@mailchimp/mailchimp_marketing'

import type { NextApiRequest, NextApiResponse } from 'next'

const { MAILCHIMP_API_KEY, MAILCHIMP_NEWSLETTER_LIST_ID, MAILCHIMP_SERVER } = process.env
const ERROR_PATH = 'pages/api/pep.js'

mailchimpMarketing.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: MAILCHIMP_SERVER,
})
const prisma = getPrisma()

export default async function ApiPepEndpoint(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (
      MAILCHIMP_API_KEY === undefined ||
      MAILCHIMP_NEWSLETTER_LIST_ID === undefined ||
      MAILCHIMP_SERVER === undefined
    ) {
      return handleError(new ApiError('Some env vars are undefined.', 500), ERROR_PATH, res)
    }

    if (req.method !== 'POST') {
      return handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
    }

    const { email, jobId } = req.body

    if (typeof email !== 'string') {
      return handleError(new ApiError('Unprocessable Entity.', 422, true), ERROR_PATH, res)
    }

    const foundJobsCount = await prisma.job.count({
      where: {
        id: jobId,
      },
    })

    if (foundJobsCount === 0) {
      return handleError(new ApiError('Unprocessable Entity.', 422, true), ERROR_PATH, res)
    }

    // https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/
    await mailchimpMarketing.lists.addListMember(MAILCHIMP_NEWSLETTER_LIST_ID, {
      email_address: email,
      language: 'fr',
      status: 'pending',
    })

    const existingLead = await prisma.lead.findFirst({
      where: {
        email,
      },
    })

    if (existingLead === null) {
      await prisma.lead.create({
        data: {
          email,
          fromJobId: jobId,
          withNewsletter: true,
        },
      })
    }

    res.json({
      data: null,
      hasError: false,
    })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}
