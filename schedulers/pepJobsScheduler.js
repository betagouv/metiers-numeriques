var notion = require('../lib/notion')
const JOB_FILTERS = [
    "Technicienne / Technicien support utilisateurs",
    "Cheffe / Chef de projet maitrise d’œuvre SI",
    "Cheffe / Chef de projet maitrise d'ouvrage SI",
    "Spécialiste outils, systèmes d’exploitation, réseaux et télécoms",
    "Administratrice / Administrateur d’outils, de systèmes, de réseaux et/ou de télécoms",
    "Architecte technique",
    "Développeuse / Développeur",
    "Responsable d’exploitation",
    "Technicienne / Technicien d’exploitation et maintenance 1er niveau",
    "Responsable réseaux et télécoms",
    "Responsable Sécurité des Systèmes d’Information - RSSI",
    "Gestionnaire des systèmes applicatifs",
    "Responsable du système d’information « métier »",
    "Data Scientist",
    "Urbaniste des systèmes d’information",
    "Directrice / Directeur des données",
    "Intégratrice / Intégrateur d’exploitation",
    "Spécialiste méthode et outils / qualité / sécurité",
    "Administratrice / Administratrice de bases de données",
    "Analyste de données",
    "Analyste en détection d'intrusions",
    "Analyste en traitement d'incidents informatiques",
    "Assistante / Assistant fonctionnel",
    "Auditrice / Auditrice en sécurité des systèmes d'information",
    "Chargée / Chargé de référencement",
    "Chargée / Chargé de relation sur l'offre de services SI",
    "Chief Digital Officer",
    "Coach Agile",
    "Conceptrice / Concepteur",
    "Conseillère / Conseiller en systèmes d’information",
    "Data engineer",
    "Data Steward",
    "Déléguée / Délégué à la protection des données numériques",
    "Designer UX",
    "Directrice / Directeur de projets SI",
    "Directrice / Directeur des systèmes d’information",
    "Intégratrice / Intégrateur logiciel",
    "Intrapreneuse/Intrapreneur de Startups d'État",
    "Paramétreur(euse) logiciel",
    "Pilote en détection d'intrusion",
    "Pilote en traitement d'incidents informatiques",
    "Product Owner",
    "Responsable d’applications",
    "Responsable d’entité",
    "Responsable d’études SI",
    "Responsable Green IT",
    "Scrum master",
    "Superviseuse / Superviseur d’exploitation",
    "Tech lead",
    "Technicienne / Technicien poste de travail et maintenance",
    "Technicienne / Technicien réseaux, télécoms et/ou Multimédias et maintenance",
    "Testeuse / Testeur"
]

const createPepProperties = (pepJob) => {
    const properties = Object.keys(pepJob).reduce((acc, property) => {
        if (property === 'JobDescriptionTranslation_JobTitle_') {
            acc['Name'] = {
                title: [
                    {
                        "text": {
                            "content": pepJob[property]
                        }
                    }
                ]
            }
        } else {
            let propertyContent = [pepJob[property]]
            if (pepJob[property].length > 2000) {
                propertyContent = [pepJob[property].slice(0, 2000),pepJob[property].slice(2000)]
            }
            acc[property] = {
                rich_text: propertyContent.map(content => (
                    {
                        "text": {
                            "content": content
                        }
                    })
                )
                
            }
        }
        
        return acc
    }, {})
    properties['Link'] = {
        url: `https://place-emploi-public.gouv.fr/offre-emploi/${pepJob.Offer_Reference_}/`
    }
    return properties
}


module.exports.fetchPepJob = async () => {
    try {
        const request=require('request')
        const csv=require('csvtojson')
        let count = 0
        csv({
            delimiter: ';',
        })
        .fromStream(request.get(process.env.PEP_ENDPOINT))
        .subscribe((pepJob)=>{
            return new Promise(async (resolve, reject)=>{
                if (pepJob.JobDescription_ProfessionalCategory_ === 'Vacant' && 
                    JOB_FILTERS.includes(pepJob.JobDescription_PrimaryProfile_) && count < 10) {
                    const page = await notion.getPage(process.env.PEP_DATABASE, pepJob.OfferID)
                    if (!page) {
                        await notion.createPage(process.env.PEP_DATABASE, createPepProperties(pepJob))
                    }
                    count = count + 1
                }
                // long operation for each json e.g. transform / write into database.
                resolve()
            })
        },() => {},() => {});
    } catch(e) {
        throw new Error(`Erreur lors de la récupération des offres de la pep`, e)
    }
}
