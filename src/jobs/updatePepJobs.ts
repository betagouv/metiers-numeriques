/* eslint-disable no-await-in-loop, no-continue */

import axios from 'axios'
import ß from 'bhala'
import csv from 'csvtojson'

import handleError from '../helpers/handleError'
import AppError from '../libs/AppError'
import notion from '../services/notion'

const { PEP_ENDPOINT } = process.env as {
  [key: string]: string
}

const JOB_FILTERS = [
  'Technicienne / Technicien support utilisateurs',
  'Cheffe / Chef de projet maitrise d’œuvre SI',
  "Cheffe / Chef de projet maitrise d'ouvrage SI",
  'Spécialiste outils, systèmes d’exploitation, réseaux et télécoms',
  'Administratrice / Administrateur d’outils, de systèmes, de réseaux et/ou de télécoms',
  'Architecte technique',
  'Développeuse / Développeur',
  'Responsable d’exploitation',
  'Technicienne / Technicien d’exploitation et maintenance 1er niveau',
  'Responsable réseaux et télécoms',
  'Responsable Sécurité des Systèmes d’Information - RSSI',
  'Gestionnaire des systèmes applicatifs',
  'Responsable du système d’information « métier »',
  'Data Scientist',
  'Urbaniste des systèmes d’information',
  'Directrice / Directeur des données',
  'Intégratrice / Intégrateur d’exploitation',
  'Spécialiste méthode et outils / qualité / sécurité',
  'Administratrice / Administratrice de bases de données',
  'Analyste de données',
  "Analyste en détection d'intrusions",
  "Analyste en traitement d'incidents informatiques",
  'Assistante / Assistant fonctionnel',
  "Auditrice / Auditrice en sécurité des systèmes d'information",
  'Chargée / Chargé de référencement',
  "Chargée / Chargé de relation sur l'offre de services SI",
  'Chief Digital Officer',
  'Coach Agile',
  'Conceptrice / Concepteur',
  'Conseillère / Conseiller en systèmes d’information',
  'Data engineer',
  'Data Steward',
  'Déléguée / Délégué à la protection des données numériques',
  'Designer UX',
  'Directrice / Directeur de projets SI',
  'Directrice / Directeur des systèmes d’information',
  'Intégratrice / Intégrateur logiciel',
  "Intrapreneuse/Intrapreneur de Startups d'État",
  'Paramétreur(euse) logiciel',
  "Pilote en détection d'intrusion",
  "Pilote en traitement d'incidents informatiques",
  'Product Owner',
  'Responsable d’applications',
  'Responsable d’entité',
  'Responsable d’études SI',
  'Responsable Green IT',
  'Scrum master',
  'Superviseuse / Superviseur d’exploitation',
  'Tech lead',
  'Technicienne / Technicien poste de travail et maintenance',
  'Technicienne / Technicien réseaux, télécoms et/ou Multimédias et maintenance',
  'Testeuse / Testeur',
]

export default async function updatePepJobs() {
  try {
    const { data: pepJobsAsCsv } = await axios.get(PEP_ENDPOINT)
    const pepJobs = await csv({
      delimiter: ';',
    }).fromString(pepJobsAsCsv)

    for (const pepJob of pepJobs) {
      if (
        pepJob.JobDescription_ProfessionalCategory_ !== 'Vacant' ||
        !JOB_FILTERS.includes(pepJob.JobDescription_PrimaryProfile_)
      ) {
        continue
      }

      const isInNotion = await notion.hasPepJob(pepJob.OfferID)
      if (isInNotion) {
        // ß.debug(`[jobs/updatePepJobs()] PEP job #${pepJob.OfferID} is already in Notion.`)

        continue
      }

      ß.info(`[jobs/updatePepJobs()] Adding PEP job #${pepJob.OfferID} to Notion…`)
      await notion.createPepJob(pepJob)
    }
  } catch (err) {
    if (!(err instanceof AppError)) {
      handleError(err, 'jobs/updatePepJobs()')
    }

    process.exit(1)
  }
}
