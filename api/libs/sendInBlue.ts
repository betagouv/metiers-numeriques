/* eslint-disable sort-keys-fix/sort-keys-fix */
import { prisma } from '@api/libs/prisma'
import { formatCandidateApplicationFile, getCandidateFullName } from '@app/libs/candidate'
import { handleError } from '@common/helpers/handleError'
import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import SendInBlue from 'sib-api-v3-sdk'

// Create global client
const sendInBlueClient = SendInBlue.ApiClient.instance
// Authenticate client with API Key
const apiKey = sendInBlueClient.authentications['api-key']
apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY

// Create transactional client
const sendInBlueTransacClient = new SendInBlue.TransactionalEmailsApi()

type Receiver = { email: string; name?: string }
type Attachment = { name: string; url: string } | { content: string; name: string }

type TransacEmailProps = {
  attachment?: Attachment[]
  params: Record<string, string | string[]>
  subject: string
  templateId: number
  to: Receiver[]
}

const DEFAULT_SENDER: Receiver = {
  email: 'contact@metiers.numerique.gouv.fr',
  name: 'Métiers du Numérique',
}

const sendTransacEmail = async ({ attachment, params, subject, templateId, to }: TransacEmailProps) => {
  if (process.env.CI) {
    return
  }
  try {
    const environment = process.env.SENTRY_ENVIRONMENT
    // Helps distinguish production emails from others
    const taggedSubject = environment === 'production' ? subject : `[${environment?.toUpperCase()}] ${subject}`

    return sendInBlueTransacClient.sendTransacEmail({
      to,
      sender: DEFAULT_SENDER,
      subject: taggedSubject,
      templateId,
      attachment,
      params,
    })
  } catch (err) {
    handleError(err, 'api/libs/sendInBlue.ts > query.sendTransacEmail()')
  }
}

export const sendAccountRequestEmail = async (fullname: string, userId: string) =>
  sendTransacEmail({
    subject: "Nouvelle demande d'accès à l'espace recruteur",
    to: [DEFAULT_SENDER],
    templateId: 6,
    params: { fullname, verifyUrl: `${process.env.DOMAIN_URL}/admin/user/${userId}` },
  })

export const sendApplicationEmail = async (applicationId: string) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: {
      cvFile: true,
      candidate: {
        include: {
          user: true,
          domains: true,
          professions: true,
        },
      },
    },
  })

  if (!application) {
    return // TODO: handle error
  }

  const candidateName = getCandidateFullName(application.candidate)

  const applicationSummary = Buffer.from(formatCandidateApplicationFile(application))
  const applicationSummaryBase64 = applicationSummary.toString('base64')
  const attachment = [
    { name: application.cvFile.title, url: application.cvFile.url },
    { name: `Candidature - ${candidateName}.txt`, content: applicationSummaryBase64 },
  ]

  // Candidate applied to a specific offer
  if (application.jobId) {
    const job = await prisma.job.findUnique({
      where: { id: application.jobId },
      include: { applicationContacts: true },
    })

    if (job) {
      return sendTransacEmail({
        templateId: 7,
        subject: `Nouvelle candidature pour le poste: ${job.title}`,
        to: [...job.applicationContacts.map(contact => ({ email: contact.email, name: contact.name })), DEFAULT_SENDER],
        params: {
          introSentence: `${candidateName} vient de postuler pour le poste: ${job.title}.`,
          checkUrl: `${process.env.DOMAIN_URL}/admin/job/${job.id}/pool`,
        },
        attachment,
      })
    }
  }

  // Candidate sent an adhoc application
  return sendTransacEmail({
    subject: 'Nouvelle candidature spontanée',
    to: [DEFAULT_SENDER],
    templateId: 7,
    params: {
      introSentence: `${candidateName} vient déposer une candidature spontanée.`,
      checkUrl: `${process.env.DOMAIN_URL}/admin/applications`,
    },
    attachment,
  })
}

export const sendJobApplicationRejectedEmail = async (applicationId: string) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: {
      job: true,
      candidate: {
        include: { domains: true, professions: true, user: true },
      },
    },
  })

  if (!application) {
    return // TODO: handle error
  }

  await sendTransacEmail({
    subject: 'Votre candidature au poste de: {{ params.jobTitle }}',
    to: [{ name: getCandidateFullName(application.candidate), email: application.candidate.user.email }],
    templateId: 8,
    params: {
      firstName: application.candidate.user.firstName,
      jobTitle: application?.job?.title || 'Candidature spontanée',
      rejectionReasons: application.rejectionReasons,
      jobsUrl: `${process.env.DOMAIN_URL}/offres-emploi`,
    },
  })
}

export const sendResetPasswordEmail = async (user: User) => {
  const resetPasswordToken = await jwt.sign({ userId: user.id }, process.env.NEXTAUTH_SECRET, { expiresIn: '48h' })

  await sendTransacEmail({
    subject: 'Réinitialisation de votre mot de passe sur Métiers du Numérique',
    to: [{ name: `${user.firstName} ${user.lastName}`, email: user.email }],
    templateId: 9,
    params: {
      firstName: user.firstName,
      resetPasswordUrl: `${process.env.DOMAIN_URL}/mot-de-passe?resetToken=${resetPasswordToken}`,
    },
  })
}
