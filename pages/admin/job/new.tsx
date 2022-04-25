import { getPrisma } from '@api/helpers/getPrisma'
import AdminHeader from '@app/atoms/AdminHeader'
import Title from '@app/atoms/Title'
import { slugify } from '@common/helpers/slugify'
import { JobContractType, JobRemoteStatus, JobState } from '@prisma/client'
import cuid from 'cuid'
import dayjs from 'dayjs'

export default function AdminJobNewPage() {
  return (
    <AdminHeader>
      <Title>Création de l’offre en cours…</Title>
    </AdminHeader>
  )
}

export async function getServerSideProps() {
  const prisma = getPrisma()

  const id = cuid()
  const title = 'Nouvelle offre d’emploi'
  const slug = slugify(title, id)

  const job = await prisma.job.create({
    data: {
      contractTypes: [JobContractType.NATIONAL_CIVIL_SERVANT, JobContractType.CONTRACT_WORKER],
      expiredAt: dayjs().add(2, 'months').toDate(),
      id,
      missionDescription: '',
      remoteStatus: JobRemoteStatus.NONE,
      seniorityInMonths: 0,
      slug,
      state: JobState.DRAFT,
      title,
      updatedAt: dayjs().toDate(),
    },
  })

  return {
    redirect: {
      destination: `/admin/job/${job.id}`,
      permanent: false,
    },
  }
}
