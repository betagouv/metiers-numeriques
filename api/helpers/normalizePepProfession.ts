import ß from 'bhala'
import * as R from 'ramda'

import type { Profession } from '@prisma/client'

const makeGetProfessionIdFromName = (professions: Profession[]): ((professionName: string) => string) => {
  const findProfessionByName = name => R.find<Profession>(R.propEq('name', name))(professions)

  return professionName => {
    const profession = findProfessionByName(professionName)

    if (profession === undefined) {
      throw new Error(`Could not find profession with name "${professionName}".`)
    }

    return profession.id
  }
}

export function normalizePepProfession(professions: Profession[], pepProfession: string): string | undefined {
  const getProfessionIdFromName = makeGetProfessionIdFromName(professions)

  switch (pepProfession) {
    case 'Architecte technique':
    case 'Conceptrice / Concepteur':
    case 'Urbaniste des systèmes d’information':
      return getProfessionIdFromName('Architecture')

    case 'Développeuse / Développeur':
    case 'Intégratrice / Intégrateur logiciel':
      return getProfessionIdFromName('Développement')

    case 'Administratrice / Administratrice de bases de données':
    case 'Analyste de données':
    case 'Data engineer':
    case 'Data Scientist':
      return getProfessionIdFromName('Données')

    case 'Chief Digital Officer':
    case 'Directrice / Directeur de projets SI':
    case 'Directrice / Directeur des systèmes d’information':
    case 'Responsable d’entité':
      return getProfessionIdFromName('Gestion')

    case 'Gestionnaire des systèmes applicatifs':
    case 'Intégratrice / Intégrateur d’exploitation':
    case 'Responsable d’exploitation':
    case 'Responsable réseaux et télécoms':
    case 'Technicienne / Technicien d’exploitation et maintenance 1er niveau':
    case 'Technicienne / Technicien réseaux, télécoms et/ou Multimédias et maintenance':
      return getProfessionIdFromName('Infrastructure')

    case 'Cheffe / Chef de projet maitrise d’œuvre SI':
    case "Cheffe / Chef de projet maitrise d'ouvrage SI":
    case 'Product Owner':
      return getProfessionIdFromName('Projet / Produit')

    case 'Administratrice / Administrateur d’outils, de systèmes, de réseaux et/ou de télécoms':
    case 'Spécialiste outils, systèmes d’exploitation, réseaux et télécoms':
      return getProfessionIdFromName('Serveur / Cloud')

    case "Analyste en détection d'intrusions":
    case "Auditrice / Auditrice en sécurité des systèmes d'information":
    case "Pilote en détection d'intrusion":
    case 'Responsable Sécurité des Systèmes d’Information - RSSI':
      return getProfessionIdFromName('Sécurité')

    case "Chargée / Chargé de relation sur l'offre de services SI":
    case "Pilote en traitement d'incidents informatiques":
    case 'Technicienne / Technicien poste de travail et maintenance':
    case 'Technicienne / Technicien support utilisateurs':
      return getProfessionIdFromName('Support')

    case 'Assistante / Assistant fonctionnel':
    case 'Chargée / Chargé de référencement':
    case 'Conseillère / Conseiller en systèmes d’information':
    case 'Responsable d’applications':
    case 'Responsable d’études SI':
    case 'Responsable du système d’information « métier »':
    case 'Spécialiste méthode et outils / qualité / sécurité':
      return getProfessionIdFromName('Autres')

    default:
      ß.error(`Unhandled PEP profession "${pepProfession}".`)
  }
}
