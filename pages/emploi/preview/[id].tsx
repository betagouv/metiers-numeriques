import { prisma } from '@api/libs/prisma'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'

import JobPage, { isJobFilledOrExpired } from '../[slug]'

export default JobPage

export async function getServerSideProps({ params: { id } }) {
  const job = await prisma.job.findUnique({
    include: {
      address: true,
      applicationContacts: true,
      infoContact: true,
      profession: true,
      recruiter: true,
    },
    where: {
      id,
    },
  })

  if (job === null) {
    return {
      notFound: true,
    }
  }

  const isFilledOrExpired = isJobFilledOrExpired(job)
  const jobWithHumanDates = stringifyDeepDates(job)

  return {
    props: {
      data: jobWithHumanDates,
      isFilledOrExpired,
      isPreview: true,
    },
  }
}
