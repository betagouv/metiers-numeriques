import showdown from 'showdown'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const converter = new showdown.Converter()

const convertMarkdownFieldsToHTML = async () => {
  const jobs = await prisma.job.findMany()

  await jobs.map(async job => {
    try {
      await prisma.job.update({
        data: {
          missionDescription: converter.makeHtml(job.missionDescription),
          teamDescription: converter.makeHtml(job.teamDescription),
          contextDescription: converter.makeHtml(job.contextDescription),
          perksDescription: converter.makeHtml(job.perksDescription),
          tasksDescription: converter.makeHtml(job.tasksDescription),
          profileDescription: converter.makeHtml(job.profileDescription),
          particularitiesDescription: converter.makeHtml(job.particularitiesDescription),
          processDescription: converter.makeHtml(job.processDescription),
        },
        where: { id: job.id }
      })
      console.log('Job ', job.title, ' updated as HTML')
    } catch (e) {
      console.log('Error while converting job', job.id, ':', e)
    }
  })

  const institutions = await prisma.institution.findMany()

  await institutions.map(async institution => {
    try {
      await prisma.institution.update({
        data: {
          description: converter.makeHtml(institution.description),
          values: converter.makeHtml(institution.values),
          challenges: converter.makeHtml(institution.challenges),
          mission: converter.makeHtml(institution.mission),
          projects: converter.makeHtml(institution.projects),
          organisation: converter.makeHtml(institution.organisation),
          figures: converter.makeHtml(institution.figures),
          wantedSkills: converter.makeHtml(institution.wantedSkills),
          recruitmentProcess: converter.makeHtml(institution.recruitmentProcess),
          workingWithUs: converter.makeHtml(institution.workingWithUs),
        },
        where: { id: institution.id }
      })
      console.log('Institution ', institution.name, ' updated as HTML')
    } catch (e) {
      console.log('Error while converting institution', institution.id, ':', e)
    }
  })
}

convertMarkdownFieldsToHTML().then(() => console.log('Success!'))
