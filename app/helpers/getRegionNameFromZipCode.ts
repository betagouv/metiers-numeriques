import handleError from '@common/helpers/handleError'

import type { REGION } from '@common/constants'

const DEPARTEMENTS: Array<{
  name: string
  number: string
  regionName: keyof typeof REGION
}> = [
  {
    name: 'Ain',
    number: '01',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Aisne',
    number: '02',
    regionName: 'Hauts-de-France',
  },
  {
    name: 'Allier',
    number: '03',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Alpes-de-Haute-Provence',
    number: '04',
    regionName: 'Provence-Alpes-Côte d’Azur',
  },
  {
    name: 'Hautes-Alpes',
    number: '05',
    regionName: 'Provence-Alpes-Côte d’Azur',
  },
  {
    name: 'Alpes-Maritimes',
    number: '06',
    regionName: 'Provence-Alpes-Côte d’Azur',
  },
  {
    name: 'Ardèche',
    number: '07',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Ardennes',
    number: '08',
    regionName: 'Grand Est',
  },
  {
    name: 'Ariège',
    number: '09',
    regionName: 'Occitanie',
  },
  {
    name: 'Aube',
    number: '10',
    regionName: 'Grand Est',
  },
  {
    name: 'Aude',
    number: '11',
    regionName: 'Occitanie',
  },
  {
    name: 'Aveyron',
    number: '12',
    regionName: 'Occitanie',
  },
  {
    name: 'Bouches-du-Rhône',
    number: '13',
    regionName: 'Provence-Alpes-Côte d’Azur',
  },
  {
    name: 'Calvados',
    number: '14',
    regionName: 'Normandie',
  },
  {
    name: 'Cantal',
    number: '15',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Charente',
    number: '16',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Charente-Maritime',
    number: '17',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Cher',
    number: '18',
    regionName: 'Centre-Val de Loire',
  },
  {
    name: 'Corrèze',
    number: '19',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    name: "Côte-d'Or",
    number: '21',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    name: "Côtes-d'Armor",
    number: '22',
    regionName: 'Bretagne',
  },
  {
    name: 'Creuse',
    number: '23',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Dordogne',
    number: '24',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Doubs',
    number: '25',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Drôme',
    number: '26',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Eure',
    number: '27',
    regionName: 'Normandie',
  },
  {
    name: 'Eure-et-Loir',
    number: '28',
    regionName: 'Centre-Val de Loire',
  },
  {
    name: 'Finistère',
    number: '29',
    regionName: 'Bretagne',
  },
  {
    name: 'Corse-du-Sud',
    number: '2A',
    regionName: 'Corse',
  },
  {
    name: 'Haute-Corse',
    number: '2B',
    regionName: 'Corse',
  },
  {
    name: 'Gard',
    number: '30',
    regionName: 'Occitanie',
  },
  {
    name: 'Haute-Garonne',
    number: '31',
    regionName: 'Occitanie',
  },
  {
    name: 'Gers',
    number: '32',
    regionName: 'Occitanie',
  },
  {
    name: 'Gironde',
    number: '33',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Hérault',
    number: '34',
    regionName: 'Occitanie',
  },
  {
    name: 'Ille-et-Vilaine',
    number: '35',
    regionName: 'Bretagne',
  },
  {
    name: 'Indre',
    number: '36',
    regionName: 'Centre-Val de Loire',
  },
  {
    name: 'Indre-et-Loire',
    number: '37',
    regionName: 'Centre-Val de Loire',
  },
  {
    name: 'Isère',
    number: '38',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Jura',
    number: '39',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Landes',
    number: '40',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Loir-et-Cher',
    number: '41',
    regionName: 'Centre-Val de Loire',
  },
  {
    name: 'Loire',
    number: '42',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Haute-Loire',
    number: '43',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Loire-Atlantique',
    number: '44',
    regionName: 'Pays de la Loire',
  },
  {
    name: 'Loiret',
    number: '45',
    regionName: 'Centre-Val de Loire',
  },
  {
    name: 'Lot',
    number: '46',
    regionName: 'Occitanie',
  },
  {
    name: 'Lot-et-Garonne',
    number: '47',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Lozère',
    number: '48',
    regionName: 'Occitanie',
  },
  {
    name: 'Maine-et-Loire',
    number: '49',
    regionName: 'Pays de la Loire',
  },
  {
    name: 'Manche',
    number: '50',
    regionName: 'Normandie',
  },
  {
    name: 'Marne',
    number: '51',
    regionName: 'Grand Est',
  },
  {
    name: 'Haute-Marne',
    number: '52',
    regionName: 'Grand Est',
  },
  {
    name: 'Mayenne',
    number: '53',
    regionName: 'Pays de la Loire',
  },
  {
    name: 'Meurthe-et-Moselle',
    number: '54',
    regionName: 'Grand Est',
  },
  {
    name: 'Meuse',
    number: '55',
    regionName: 'Grand Est',
  },
  {
    name: 'Morbihan',
    number: '56',
    regionName: 'Bretagne',
  },
  {
    name: 'Moselle',
    number: '57',
    regionName: 'Grand Est',
  },
  {
    name: 'Nièvre',
    number: '58',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Nord',
    number: '59',
    regionName: 'Hauts-de-France',
  },
  {
    name: 'Oise',
    number: '60',
    regionName: 'Hauts-de-France',
  },
  {
    name: 'Orne',
    number: '61',
    regionName: 'Normandie',
  },
  {
    name: 'Pas-de-Calais',
    number: '62',
    regionName: 'Hauts-de-France',
  },
  {
    name: 'Puy-de-Dôme',
    number: '63',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Pyrénées-Atlantiques',
    number: '64',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Hautes-Pyrénées',
    number: '65',
    regionName: 'Occitanie',
  },
  {
    name: 'Pyrénées-Orientales',
    number: '66',
    regionName: 'Occitanie',
  },
  {
    name: 'Bas-Rhin',
    number: '67',
    regionName: 'Grand Est',
  },
  {
    name: 'Haut-Rhin',
    number: '68',
    regionName: 'Grand Est',
  },
  {
    name: 'Rhône',
    number: '69',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Haute-Saône',
    number: '70',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Saône-et-Loire',
    number: '71',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Sarthe',
    number: '72',
    regionName: 'Pays de la Loire',
  },
  {
    name: 'Savoie',
    number: '73',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Haute-Savoie',
    number: '74',
    regionName: 'Auvergne-Rhône-Alpes',
  },
  {
    name: 'Paris',
    number: '75',
    regionName: 'Île-de-France',
  },
  {
    name: 'Seine-Maritime',
    number: '76',
    regionName: 'Normandie',
  },
  {
    name: 'Seine-et-Marne',
    number: '77',
    regionName: 'Île-de-France',
  },
  {
    name: 'Yvelines',
    number: '78',
    regionName: 'Île-de-France',
  },
  {
    name: 'Deux-Sèvres',
    number: '79',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Somme',
    number: '80',
    regionName: 'Hauts-de-France',
  },
  {
    name: 'Tarn',
    number: '81',
    regionName: 'Occitanie',
  },
  {
    name: 'Tarn-et-Garonne',
    number: '82',
    regionName: 'Occitanie',
  },
  {
    name: 'Var',
    number: '83',
    regionName: 'Provence-Alpes-Côte d’Azur',
  },
  {
    name: 'Vaucluse',
    number: '84',
    regionName: 'Provence-Alpes-Côte d’Azur',
  },
  {
    name: 'Vendée',
    number: '85',
    regionName: 'Pays de la Loire',
  },
  {
    name: 'Vienne',
    number: '86',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Haute-Vienne',
    number: '87',
    regionName: 'Nouvelle-Aquitaine',
  },
  {
    name: 'Vosges',
    number: '88',
    regionName: 'Grand Est',
  },
  {
    name: 'Yonne',
    number: '89',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Territoire de Belfort',
    number: '90',
    regionName: 'Bourgogne-Franche-Comté',
  },
  {
    name: 'Essonne',
    number: '91',
    regionName: 'Île-de-France',
  },
  {
    name: 'Hauts-de-Seine',
    number: '92',
    regionName: 'Île-de-France',
  },
  {
    name: 'Seine-Saint-Denis',
    number: '93',
    regionName: 'Île-de-France',
  },
  {
    name: 'Val-de-Marne',
    number: '94',
    regionName: 'Île-de-France',
  },
  {
    name: "Val-d'Oise",
    number: '95',
    regionName: 'Île-de-France',
  },
  {
    name: 'Guadeloupe',
    number: '971',
    regionName: 'Guadeloupe',
  },
  {
    name: 'Martinique',
    number: '972',
    regionName: 'Martinique',
  },
  {
    name: 'Guyane',
    number: '973',
    regionName: 'Guyane',
  },
  {
    name: 'La Réunion',
    number: '974',
    regionName: 'La Réunion',
  },
  {
    name: 'Mayotte',
    number: '976',
    regionName: 'Mayotte',
  },
]

export default function getRegionNameFromZipCode(zipCode: string): string | undefined {
  try {
    if (zipCode.length < 4 || zipCode.length > 5) {
      return
    }

    const normalizedZipCode = zipCode.length === 4 ? `0${zipCode}` : zipCode

    const foundDepartement = DEPARTEMENTS.find(({ number }) => normalizedZipCode.startsWith(number))
    if (foundDepartement === undefined) {
      return
    }

    return foundDepartement.regionName
  } catch (err) {
    handleError(err, 'app/helpers/getRegionNameFromZipCode()')
  }
}
