/* eslint-disable no-await-in-loop, no-continue */

import axios from 'axios'
import ß from 'bhala'
import objectHash from 'object-hash'
import xlsx from 'xlsx'

import handleError from '../helpers/handleError'
import AppError from '../libs/AppError'
import notion from '../services/notion'
import { SeekubeJob, SeekubeJobNormalized } from '../types/Seekube'

const { SKB_ENDPOINT } = process.env as {
  [key: string]: string
}

const info = (message: string) => ß.info(`[jobs/updateSkbJobs()] ${message}`)
const normalizeDateDeDebut = (dateDeDebut: string) =>
  /^\d{4}-\d{2}$/.test(dateDeDebut) ? new Date(dateDeDebut) : new Date(0)

export default async function updateSkbJobs() {
  try {
    info('Fetching Seekube XLSX export as Array Buffer…')
    const { data: skbJopbsAsXlsxArrayBuffer } = await axios.get<ArrayBuffer>(SKB_ENDPOINT, {
      responseType: 'arraybuffer',
    })

    info('Converting to Buffer…')
    const skbJopbsAsXlsxBuffer = Buffer.from(skbJopbsAsXlsxArrayBuffer)

    info('Parsing Buffer data…')
    const skbJobsAsWorkbook = xlsx.read(skbJopbsAsXlsxBuffer, {
      type: 'buffer',
    })

    info('Converting data to JSON…')
    const skbJobsAsWorkbookSheetName = skbJobsAsWorkbook.SheetNames[0]
    const skbJobsAsWorkSheet = skbJobsAsWorkbook.Sheets[skbJobsAsWorkbookSheetName]
    const skbJobs = xlsx.utils.sheet_to_json<SeekubeJob>(skbJobsAsWorkSheet)
    const publishedSkJobs = skbJobs.filter(({ Statut }) => Statut === 'published')

    for (const skbJob of publishedSkJobs) {
      const id = objectHash({
        location: skbJob.Localisation,
        title: skbJob.Titre,
      })

      const isInNotion = await notion.hasSkbJob(id)
      if (isInNotion) {
        ß.debug(`[jobs/updateSkbJobs()] Seekube job #${id} is already in Notion.`)

        continue
      }

      const normalizedSkbJob: SeekubeJobNormalized = {
        DateDeDebut: normalizeDateDeDebut(skbJob['Date de début - recruteur']),
        DegreDeMobilite: skbJob['Degré de mobilité'],
        Description: skbJob.Description.replace(/\r\n/g, '\n'),
        Email: skbJob.Mail,
        Entreprise: skbJob.Entreprise,
        EstPublie: true,
        // Internally generated ID
        ID: id,
        Localisation: skbJob.Localisation,
        Nom: skbJob.Nom,
        NombreDeCandidatures: skbJob['#Candidatures'],
        NombreDeCreneauxDisponibles: skbJob['Nb créneaux disponibes'],
        Prenom: skbJob.Prénom,
        SituationProfessionnelle: skbJob['Situation professionnelle '],
        Titre: skbJob.Titre,
      }

      ß.debug(`[jobs/updateSkbJobs()] Adding Seekube job #${id} to Notion…`)
      await notion.createSkbJob(normalizedSkbJob)
    }
  } catch (err) {
    if (!(err instanceof AppError)) {
      handleError(err, 'jobs/updateSkbJobs()')
    }

    process.exit(1)
  }
}
