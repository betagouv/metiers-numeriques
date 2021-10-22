import { formatDistance, parse } from 'date-fns';
import { fr } from 'date-fns/locale';

export const JOB_FILTERS = [
    'Technicienne / Technicien support utilisateurs',
    'Cheffe / Chef de projet maitrise d’œuvre SI',
    'Cheffe / Chef de projet maitrise d\'ouvrage SI',
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
    'Analyste en détection d\'intrusions',
    'Analyste en traitement d\'incidents informatiques',
    'Assistante / Assistant fonctionnel',
    'Auditrice / Auditrice en sécurité des systèmes d\'information',
    'Chargée / Chargé de référencement',
    'Chargée / Chargé de relation sur l\'offre de services SI',
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
    'Intrapreneuse/Intrapreneur de Startups d\'État',
    'Paramétreur(euse) logiciel',
    'Pilote en détection d\'intrusion',
    'Pilote en traitement d\'incidents informatiques',
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
];

export const createPepProperties = (pepJob: any) => {
    const properties = Object.keys(pepJob).reduce((acc: any, property) => {
        if ([
            'SchedulingData_DefaultPublicationBeginDate_',
            'SchedulingData_DefaultPublicationEndDate_',
            'FirstPublicationDate',
            'OF_CustomFields_Date1_',
            'Offer_ModificationDate_',
            'Origin_BeginningDate_',
        ].includes(property) && pepJob[property]) {
            acc[`${property}Formated`] = {
                date: {
                    'start': parse(pepJob[property], 'dd/MM/yyyy HH:mm:ss', new Date()) || parse(pepJob[property], 'dd/MM/yyyy h:mm:ss', new Date()),
                },
            };
        }
        if (property === 'JobDescriptionTranslation_JobTitle_') {
            acc['Name'] = {
                title: [
                    {
                        'text': {
                            'content': pepJob[property],
                        },
                    },
                ],
            };
        } else {
            let propertyContent = [pepJob[property]];
            if (pepJob[property].length > 2000) {
                propertyContent = [pepJob[property].slice(0, 2000), pepJob[property].slice(2000)];
            }
            acc[property] = {
                rich_text: propertyContent.map(content => (
                    {
                        'text': {
                            'content': content,
                        },
                    }),
                ),
            };
        }
        return acc;
    }, {});
    properties['Link'] = {
        url: `https://place-emploi-public.gouv.fr/offre-emploi/${pepJob.Offer_Reference_}/`,
    };
    return properties;
};

export const dateReadableFormat = (date: Date, now = new Date()) => {
    return formatDistance(date, now, { addSuffix: true, locale: fr });
};
