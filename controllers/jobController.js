const pepdata = require('./pep.json')
const axios = require('axios')
const formatDetail = (item) => {
    const title = getItem(item.properties['Name'])
    const id = item.id
    return {
        id: id,
        limitDate: getItem(item.properties['Date limite']),
        toCandidate: getItem(item.properties['Pour candidater']),
        location: getItem(item.properties['Localisation']),
        openTo: getItem(item.properties['Poste ouvert aux']),
        advantage: getItem(item.properties['Les plus du poste']),
        team: getItem(item.properties['Équipe']),
        title: title,
        publicationDate: '13/09/2021',
        contact: getItem(item.properties['Contact']),
        profil: getItem(item.properties['Votre profil']),
        conditions: getItem(item.properties['Conditions particulières du poste']),
        more: getItem(item.properties['Pour en savoir plus']),
        teamInfo: getItem(item.properties['Si vous avez des questions']),
        tasks: getItem(item.properties['Ce que vous ferez']).split('- '),
        experiences: getItem(item.properties['Expérience']),
        salary: getItem(item.properties['rémunération']),
        ministry: getItem(item.properties['Ministère'])[0] || '',
        mission: getItem(item.properties['Mission']),
        slug: buildSlug(title, id),
    }
}

const formatDetailFromCSV = (item) => {
    const title = item.JobDescriptionTranslation_JobTitle_
    const id = item.Offer_Reference_
    return {
        id: item.Offer_Reference_,
        limitDate: '',
        toCandidate: item.Origin_CustomFieldsTranslation_ShortText1_,
        location: item.Location_JobLocation_,
        openTo: item.JobDescription_Contract ? [item.JobDescription_Contract_] : undefined,
        advantage: '',
        team: '',
        title,
        contact: item.Origin_CustomFieldsTranslation_ShortText2_,
        profil: item.JobDescriptionTranslation_Description2_,
        conditions: '',
        more: `https://place-emploi-public.gouv.fr/offre-emploi/${id}/`,
        teamInfo: '',
        publicationDate: item.FirstPublicationDate,
        tasks: undefined,
        experiences: item.ApplicantCriteria_EducationLevel_,
        salary: undefined,
        ministry: item.Origin_Entity_,
        mission: item.JobDescriptionTranslation_Description1_,
        slug: 'pep-' + buildSlug(title, id),
    }
}

const buildSlug = (title, id) => {
    const slug = `${title}-${id}`.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    return slug
}

const getItem = (item) => {
    try {
        if ('rich_text' in item) {
            return (item.rich_text[0] || {}).plain_text || '';
        } else if ('multi_select' in item) {
            return item.multi_select.map(item => item.name);
        } else if ('title' in item) {
            return item.title[0].plain_text;
        } else if ('email' in item) {
            return item.email[0].plain_text ;
        } else if ('date' in item) {
            return item.date.start;
        }
        else {
            return ''
        }
    } catch (e) {
        console.log(item, e)
        return ''
    }
}

module.exports.fetch = async (req, res) => {
    let result
    try {
        result = await axios.post(`https://api.notion.com/v1/databases/${process.env.DATABASE}/query`,null, {
            headers: {
                'Authorization': `Bearer ${process.env.TOKEN}`,
                'Notion-Version': '2021-08-16'
            }
        })
    } catch(e) {
        console.log(e)
    }
    res.render('jobs', {
        jobs: [
            ...result.data.results.map(r => formatDetail(r)),
            ...pepdata.map(item => formatDetailFromCSV(item))
        ],
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
}

module.exports.fetchDetail = async (req, res) => {

    let result

    if (req.url.includes('pep-')) {
        const id = req.url.split('-').slice(-1)[0]
        return res.render('jobDetail', {
            job: formatDetailFromCSV(pepdata.find(item => {
                return item.OfferID.toString() === id;
            })),
            contactEmail: 'contact@metiers.numerique.gouv.fr',
        });
    }
    const id = req.url.split('-').slice(-5).join('-');
    try {
        result = await axios.get(`https://api.notion.com/v1/pages/${id}`, {
            headers: {
                'Authorization': `Bearer ${process.env.TOKEN}`,
                'Notion-Version': '2021-08-16'
            }
        })
        
    } catch(e) {
        console.log(e)
    }

    res.render('jobDetail', {
        job: formatDetail(result.data),
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
}
