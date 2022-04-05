/**
 * @jest-environment jsdom
 */

import { generateJobStructuredData } from '../generateJobStructuredData'

import type { JobWithRelation } from '../../organisms/JobCard'

describe('app/helpers/generateJobStructuredData()', () => {
  test(`with a valid Date`, () => {
    const job: JobWithRelation = {
      address: {
        city: 'Paris',
        country: 'FR',
        createdAt: '2022-02-08T14:28:22.571Z' as unknown as Date,
        id: 'ckze7xbxn05023wj777t1uv0k',
        postalCode: '75007',
        region: 'Île-de-France',
        sourceId: '75107_8909_00020',
        street: '20 Avenue de Ségur',
        updatedAt: '2022-02-08T14:28:22.572Z' as unknown as Date,
      },
      addressId: 'ckze7xbxn05023wj777t1uv0k',
      applicationContacts: [
        {
          createdAt: '2022-02-10T01:16:45.206Z' as unknown as Date,
          email: 'serge.pagnucco@sg.social.gouv.fr',
          id: 'ckzgaj02e0179eoj7ovnl4cvu',
          name: 'Serge Pagnucco',
          note: null,
          phone: '',
          position: 'Directeur de projet et responsable du pôle TNRH',
          updatedAt: '2022-02-10T01:16:45.207Z' as unknown as Date,
        },
        {
          createdAt: '2022-02-10T06:35:44.326Z' as unknown as Date,
          email: 'contact@metiers-numeriques.gouv.fr',
          id: 'ckzglx7wm0182s4j7ijr1vimn',
          name: 'Métiers Numériques',
          note: null,
          phone: '',
          position: '',
          updatedAt: '2022-02-10T06:35:44.326Z' as unknown as Date,
        },
      ],
      applicationWebsiteUrl: null,
      contextDescription: null,
      contractTypes: ['CONTRACT_WORKER', 'NATIONAL_CIVIL_SERVANT'],
      createdAt: '2022-02-10T07:40:05.356Z' as unknown as Date,
      expiredAt: '2022-02-27T23:00:00.000Z' as unknown as Date,
      id: 'ckzgo7z0c0000386gl7uv1q4j',
      infoContact: {
        createdAt: '2022-02-10T06:35:44.326Z' as unknown as Date,
        email: 'contact@metiers-numeriques.gouv.fr',
        id: 'ckzglx7wm0182s4j7ijr1vimn',
        name: 'Métiers Numériques',
        note: null,
        phone: '',
        position: '',
        updatedAt: '2022-02-10T06:35:44.326Z' as unknown as Date,
      },
      infoContactId: 'ckzglx7wm0182s4j7ijr1vimn',
      missionDescription:
        "Vous pilotez le développement de Tchap, la messagerie instantanée de l’État utilisée par 250 000 agents publics. Votre objectif ? L'impact du produit auprès de ses utilisateurs.",
      missionVideoUrl: null,
      particularitiesDescription: null,
      perksDescription: "25 jours de congés et 17 jours de RTT par an / Jusqu'à 2 jours de télétravail/semaine",
      processDescription: null,
      profession: {
        createdAt: '2022-02-10T07:39:33.835Z' as unknown as Date,
        id: 'ckzgo7arv0145zcj7nc28ln1f',
        name: 'Intra',
        updatedAt: '2022-02-10T07:39:33.836Z' as unknown as Date,
      },
      professionId: 'ckzgo7arv0145zcj7nc28ln1f',
      profileDescription:
        '- Vous avez un diplôme de niveau bac+5 en informatique \n- Vous connaissez l’état de l’art de l’administration de système d’information et de produit numérique\n- Vous maitrisez un ou plusieurs domaines parmi : développement backend, développement frontend, administration système ou développement mobile\n- Vous savez faire des faire des revues de codes dans un des langages utilisés sur Tchap : Kotlin, Swift, Python ou JS',
      recruiter: {
        createdAt: '2022-01-28T16:39:59.897Z' as unknown as Date,
        fullName: null,
        id: 'ckyyms87t0279a0j7esc6vpfe',
        institutionId: null,
        logoFileId: null,
        name: 'Recruteur B',
        parentId: null,
        updatedAt: '2022-01-28T16:39:59.898Z' as unknown as Date,
        websiteUrl: null,
      },
      recruiterId: 'ckyyms87t0279a0j7esc6vpfe',
      remoteStatus: 'FULL',
      salaryMax: 120,
      salaryMin: 50,
      seniorityInMonths: 0,
      slug: "IntrapreneurIntrapreneuse-de-la-messagerie-instantanee-de-l'Etat-ckzgo7z0c0000386gl7uv1q4j",
      state: 'PUBLISHED',
      tasksDescription:
        '- Superviser l’amélioration continue de Tchap, les outils et l’organisation de l’équipe pour gagner en efficacité\n- Définir les prochaines fonctionnalités et gérer chaque étape de conception\n- Mettre en place les bonnes pratiques favorables à la qualité de la conception et du code\n- Accompagner la montée en sécurité et fiabilité de Tchap\n- Aider l’équipe à progresser sur l’état de l’art de la gestion opérationnelle (automatisation, sauvegarde de donnée, sécurité informatique)',
      teamDescription: null,
      title: "Intrapreneur/Intrapreneuse de la messagerie instantanée de l'État",
      updatedAt: '2022-02-10T07:40:05.350Z' as unknown as Date,
    }

    const result = generateJobStructuredData(job)

    expect(JSON.parse(result)).toStrictEqual({
      '@context': 'https://schema.org/',
      '@type': 'JobPosting',
      applicantLocationRequirements: {
        '@type': 'Country',
        name: 'France',
      },
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: {
          '@type': 'QuantitativeValue',
          maxValue: 120000,
          minValue: 50000,
          unitText: 'YEAR',
        },
      },
      datePosted: '2022-02-10',
      description:
        "Vous pilotez le développement de Tchap, la messagerie instantanée de l’État utilisée par 250 000 agents publics. Votre objectif ? L'impact du produit auprès de ses utilisateurs.",
      employmentType: ['CONTRACTOR', 'OTHER', 'FULL_TIME'],
      hiringOrganization: {
        '@type': 'Organization',
        name: 'Recruteur B',
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'FR',
          addressLocality: 'Paris',
          addressRegion: 'Île-de-France',
          postalCode: '75007',
          streetAddress: '20 Avenue de Ségur',
        },
      },
      title: "Intrapreneur/Intrapreneuse de la messagerie instantanée de l'État",
      validThrough: '2022-02-27',
    })
  })
})
