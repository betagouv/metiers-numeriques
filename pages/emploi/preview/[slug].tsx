import { getPrisma } from '@api/helpers/getPrisma'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'

import JobPage, { isJobFilledOrExpired } from '../[slug]'

export default JobPage

export async function getServerSideProps({ params: { slug } }) {
  const prisma = getPrisma()

  const job = await prisma.job.findUnique({
    include: {
      address: true,
      applicationContacts: true,
      infoContact: true,
      profession: true,
      recruiter: true,
    },
    where: {
      slug,
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
