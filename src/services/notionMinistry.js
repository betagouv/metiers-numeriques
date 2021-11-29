const axios = require('axios')
const { toDate } = require('date-fns-tz')
const MarkdownIt = require('markdown-it')

const handleError = require('../helpers/handleError')
const parseProperty = require('../helpers/parseProperty')
const AppError = require('../libs/AppError')
const Ministry = require('../models/Ministry')

const buildSlug = (title, id) => {
  const slug = `${title}-${id}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')

  return slug
}

class NotionMinistry {
  async getAll() {
    try {
      const { data } = await axios.post(
        `https://api.notion.com/v1/databases/${process.env.NOTION_MINISTRIES_DATABASE_ID}/query`,
        {
          page_size: 20,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
            'Notion-Version': '2021-08-16',
          },
        },
      )

      const ministries = data.results.map(this.normalize)

      return ministries
    } catch (err) {
      handleError(err, 'services/NotionMinistry.getAll()')

      throw new AppError('This error is handled.', true)
    }
  }

  async getOneById(id) {
    try {
      const { data } = await axios.get(`https://api.notion.com/v1/pages/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2021-08-16',
        },
      })

      const ministry = this.normalize(data)

      return ministry
    } catch (err) {
      handleError(err, 'services/NotionMinistry.getOneById()')
    }
  }

  normalize(rawData) {
    try {
      const title = parseProperty(rawData.properties.Titre)
      const { id } = rawData
      const md = new MarkdownIt()

      return new Ministry({
        adress: parseProperty(rawData.properties.Adresse),
        adressBis: parseProperty(rawData.properties['Adresse bis']),
        brandBlock: parseProperty(rawData.properties['Bloc marque']),
        challenges: md.render(parseProperty(rawData.properties['Nos enjeux'])),
        fullName: parseProperty(rawData.properties['Nom complet']),
        hiringProcess: md.render(parseProperty(rawData.properties['Processus de recrutement'])),
        id,
        jobsLink: parseProperty(rawData.properties['Toutes les offres disponibles']),
        joinTeam: md.render(parseProperty(rawData.properties['Nous rejoindre - Pourquoi?'])),
        joinTeamMedia: parseProperty(rawData.properties['Nous rejoindre - Infos']),
        keyNumbers: md.render(parseProperty(rawData.properties['Les chiffres clés'])),
        keyNumbersMedia: parseProperty(rawData.properties['Les chiffres clés - liens']),
        missions: md.render(parseProperty(rawData.properties['Les missions'])),
        motivation: md.render(parseProperty(rawData.properties["Raison d'être"])),
        motivationMedia: parseProperty(rawData.properties["Raison d'être complément"]),
        organization: md.render(parseProperty(rawData.properties['Notre organisation'])),
        organizationMedia: parseProperty(rawData.properties['Notre organisation compléments']),
        profile: md.render(parseProperty(rawData.properties['Ton profil'])),
        projects: md.render(parseProperty(rawData.properties['Les projets ou rélisations'])),
        projectsMedia: parseProperty(rawData.properties['Projets ou réalisations compléments']),
        publicationDate: toDate('2021-09-13T00:00:00+02:00', { timeZone: 'Europe/Paris' }),
        schedule: md.render(parseProperty(rawData.properties.Agenda)),
        slug: buildSlug(title, id),
        socialNetworks: parseProperty(rawData.properties['Réseaux sociaux']),
        testimonials: md.render(parseProperty(rawData.properties['Nos agents en parlent'])),
        testimonialsMedia: parseProperty(rawData.properties['Liens Nos agents en parlent']),
        thumbnail: parseProperty(rawData.properties['Vignette temporaire']),
        title,
        values: md.render(parseProperty(rawData.properties.Valeurs)),
        valuesMedia: parseProperty(rawData.properties['Valeurs complément']),
        visualBanner: parseProperty(rawData.properties['Bandeau visuel']),
        websites: parseProperty(rawData.properties['Site(s) institutionel(s)']),
      })
    } catch (err) {
      handleError(err, 'services/NotionMinistry.normalize()')
    }
  }
}

module.exports = new NotionMinistry()
