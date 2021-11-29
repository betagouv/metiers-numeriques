const axios = require('axios')
const { startOfDay } = require('date-fns')
const { subDays } = require('date-fns')

const notionJob = require('../../services/notionJob')
const jobsStub = require('./stubs/jobs.stub.json')

jest.mock('axios')

describe('Jobs fetch api', () => {
  it('should fetch and return a list of job', async () => {
    axios.post.mockImplementation(() => Promise.resolve({ data: jobsStub }))

    const { jobs } = await notionJob.all()

    expect(jobs.length).toEqual(jobsStub.results.length + jobsStub.results.length)
    expect(jobs[0].id).toEqual('acd471f0-2db5-4685-bdb7-eeaba1f03875')
    expect(jobs[0].title).toEqual('Data scientist F/H')
  })

  it('should fetch and return one job details', async () => {
    axios.get.mockImplementation(url =>
      Promise.resolve({
        data: jobsStub.results.find(p => url.replace('https://api.notion.com/v1/pages/', '') === p.id),
      }),
    )

    const twoDaysAgo = subDays(startOfDay(new Date()), 2)

    const result = await notionJob.get(jobsStub.results[0].id)
    expect(result.id).toEqual('acd471f0-2db5-4685-bdb7-eeaba1f03875')
    expect(result.title).toEqual('Data scientist F/H')
    expect(result.mission).toEqual(
      'Vous serez chargé(e) de mettre en œuvre des projets de Data Science qui permettront d’appuyer la mise en œuvre des politiques publiques éducatives.',
    )
    expect(result.tasks).toEqual([
      'Vous serez en charge de mettre en œuvre des projets de Data Science qui permettront d’appuyer la mise en œuvre des politiques publiques éducatives en vous appuyant sur l’ensemble des données contenues dans les systèmes informatiques de gestion (scolarité, RH, formation, finances …) ainsi que sur toutes les sources de données externes nécessaires à l’aboutissement de cas d’usage.\n',
      'Vous serez force de proposition pour élaborer les nouveaux modèles prédictifs qui vous semblent les plus pertinents au regard des orientations stratégiques du ministère en matière de numérique éducatif.\n',
      'Vous fournirez des outils d’aide à la décision et des recommandations stratégiques aux équipes métiers.\n',
      'Vous coordonnerez un grand nombre d’équipes et de métiers différents.',
    ])
    expect(result.profile).toEqual([
      'Vous avez un niveau de formation équivalent à  Bac +5\n',
      'Vous maîtrisez parfaitement les solutions logicielles de traitement, les données des algorithmes d’apprentissage automatique (Machine Learning) et des langages de programmation.\n',
      'Vous disposez d’une expertise dans le domaine de la statistique des données et dans les outils d’analyse statistique, en particulier : formats de données (JSON, XML...), base de données (PostgreSQL, SQL, NoSQL...), langages et outils de manipulation et de visualisation des données (R, Python, PgSQL, GitLab...).\n',
      'Vous avez des compétences dans les domaines liés à la production, aux échanges, à la modélisation, à la structuration et au stockage de données.',
    ])
    expect(result.experiences).toEqual(['3 ans minimum dans la mise en œuvre de projets de Data Science'])
    expect(result.locations).toEqual(['61-65 rue Dutot 75015 Paris'])
    expect(result.limitDate).toEqual(new Date('2021-10-30T00:00:00.000+02:00'))
    expect(result.entity).toBeNull()
    expect(result.publicationDate).toEqual(twoDaysAgo)
    expect(result.conditions).toEqual([])
    expect(result.teamInfo).toEqual(
      'Catherine BRAX, cheffe du bureau des systèmes d’information de gestion et du décisionnel',
    )
    expect(result.toApply).not.toBeFalsy()
    expect(result.slug).toEqual('data-scientist-fh-acd471f0-2db5-4685-bdb7-eeaba1f03875')
    expect(result.department).toEqual([
      'Ministère de l’éducation nationale de la jeunesse et des sports – Ministère de l’enseignement supérieur de la recherche et de l’innovation',
    ])
    expect(result.openedToContractTypes).toEqual(['Fonctionnaire', 'Contractuel.le'])
    expect(result.salary).toEqual('La rémunération est à définir en fonction de l’expérience et du profil')
    expect(result.team).toEqual(
      "Au sein de la sous-direction des services numériques, vous intégrerez une équipe de 23 personnes (chefs de projets nationaux et concepteurs-développeurs) dédiée aux systèmes d'information de gestion et du décisionnel.",
    )
  })
})
