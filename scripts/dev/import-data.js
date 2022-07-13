import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import cuid from 'cuid'
import fs from 'fs'

const prisma = new PrismaClient()

const BCRYPT_SALT_ROUNDS = 10

async function generatePassword() {
  const salt = await bcryptjs.genSalt(BCRYPT_SALT_ROUNDS)

  const encryptedValue = await bcryptjs.hash(cuid(), salt)

  return encryptedValue
}

const strData = fs.readFileSync('./data.json')
const data = JSON.parse(strData)

data.forEach(async candidateData => {
  try {
    const user = await prisma.user.upsert({
      create: {
        email: candidateData.email,
        firstName: candidateData.firstName,
        isActive: true,
        lastName: candidateData.lastName,
        password: await generatePassword(),
      },
      update: {
        email: candidateData.email,
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
      },
      where: {
        email: candidateData.email,
      },
    })

    const candidate = await prisma.candidate.upsert({
      create: {
        currentJob: candidateData.currentJob,
        githubUrl: candidateData.githubUrl,
        linkedInUrl: candidateData.linkedInUrl,
        phone: candidateData.phone,
        portfolioUrl: candidateData.portfolioUrl,
        region: 'France entière',
        userId: user.id,
      },
      update: {
        phone: candidateData.phone,
      },
      where: {
        userId: user.id,
      },
    })

    const cvFileUrl = `https://metiers-numeriques-staging.s3.eu-west-3.amazonaws.com/imported-data/2022-07-13/${candidateData.cvFileName}`
    const cvFile = await prisma.file.upsert({
      create: {
        title: candidateData.cvFileName,
        type: 'EXTERNAL',
        url: cvFileUrl,
      },
      update: {},
      where: {
        url: cvFileUrl,
      },
    })

    const application = await prisma.jobApplication.upsert({
      create: {
        applicationLetter: candidateData.applicationLetter,
        candidateId: candidate.id,
        cvFileId: cvFile.id,
      },
      update: {},
      where: {
        cvFileId: cvFile.id,
      },
    })

    // eslint-disable-next-line no-console
    console.log(candidateData.firstName, ' ', candidateData.lastName, ' imported in the DB under id ', application.id)
  } catch (e) {
    console.error('Error while importing ', candidateData.firstName, ' ', candidateData.lastName, ' : ', e)
  }
})
