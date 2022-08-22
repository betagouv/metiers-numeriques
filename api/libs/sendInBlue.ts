/* eslint-disable sort-keys-fix/sort-keys-fix */
import { prisma } from '@api/libs/prisma'
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

type TransacEmailProps = {
  params: Record<string, string | string[]>
  subject: string
  templateId: number
  to: Receiver[]
}

const DEFAULT_SENDER: Receiver = {
  email: 'contact@metiers.numerique.gouv.fr',
  name: 'Métiers Numériques',
}

const sendTransacEmail = async ({ params, subject, templateId, to }: TransacEmailProps) => {
  if (process.env.CI) {
    return
  }
  try {
    const environment = process.env.SENTRY_ENVIRONMENT
    // Helps distinguish production emails from others
    const taggedSubject = environment === 'production' ? environment : `[${environment}] ${subject}`

    return sendInBlueTransacClient.sendTransacEmail({
      to,
      sender: DEFAULT_SENDER,
      subject: taggedSubject,
      templateId,
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

export const sendJobApplicationRejectedEmail = async (applicationId: string) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: { job: true, candidate: { include: { user: true } } },
  })

  if (!application) {
    return // TODO: handle error
  }

  await sendTransacEmail({
    subject: 'Votre candidature au poste de: {{ params.jobTitle }}',
    to: [DEFAULT_SENDER],
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
