const pepdata = require('./pep.json')
const axios = require('axios')
const moment = require('moment');
moment.locale('fr');
function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}  

const formatDetail = (item) => {
    const title = getItem(item.properties['Name'])
    const id = item.id
    return {
        id: id,
        limitDate: getItem(item.properties['Date limite']) ? moment(getItem(item.properties['Date limite'])).format('Do MMMM YYYY') : undefined,
        toCandidate: urlify(getItem(item.properties['Pour candidater'])),
        location: getItem(item.properties['Localisation']),
        openTo: getItem(item.properties['Poste ouvert aux']),
        advantage: getItem(item.properties['Les plus du poste']),
        team: getItem(item.properties['Équipe']),
        title: title,
        publicationDate: '13/09/2021',
        readablePublicationDate: moment('13/09/2021', "DD/MM/YYYY").fromNow(),
        contact: getItem(item.properties['Contact']),
        profil: getItem(item.properties['Votre profil']).split('- ').filter(item => item),
        conditions: getItem(item.properties['Conditions particulières du poste']).split('- ').filter(item => item),
        more: urlify(getItem(item.properties['Pour en savoir plus'])),
        teamInfo: getItem(item.properties['Si vous avez des questions']),
        tasks: getItem(item.properties['Ce que vous ferez']).split('- ').filter(item => item),
        experiences: getItem(item.properties['Expérience']),
        salary: getItem(item.properties['rémunération']),
        ministry: getItem(item.properties['Ministère'])[0] || '',
        mission: urlify(getItem(item.properties['Mission'])),
        slug: buildSlug(title, id),
        hiringProcess: getItem(item.properties['Processus de recrutement'])
    }
}

const formatDetailFromPep = (job) => {
    const item = job.properties
    const title = getItem(item.Name)
    const id = job.id
    return {
        id,
        limitDate: '',
        toCandidate: getItem(item.Origin_CustomFieldsTranslation_ShortText1_),
        location: getItem(item.Location_JobLocation_).replace('- -', ''),
        openTo: getItem(item.JobDescription_Contract_) ? [getItem(item.JobDescription_Contract_)] : [],
        advantage: '',
        team: '',
        title,
        contact: getItem(item.Origin_CustomFieldsTranslation_ShortText2_),
        profil: [getItem(item.JobDescriptionTranslation_Description2_)],
        conditions: [],
        more: urlify(`https://place-emploi-public.gouv.fr/offre-emploi/${getItem(item.Offer_Reference_)}/`),
        teamInfo: '',
        readablePublicationDate: moment(getItem(item.FirstPublicationDate), "DD/MM/YYYY").fromNow(),
        publicationDate: getItem(item.FirstPublicationDate).split(' ')[0],
        tasks: undefined,
        experiences: getItem(item.ApplicantCriteria_EducationLevel_) ? [getItem(item.ApplicantCriteria_EducationLevel_)] : [],
        salary: undefined,
        ministry: getItem(item.Origin_Entity_),
        mission: urlify(getItem(item.JobDescriptionTranslation_Description1_)),
        slug: buildSlug(title, id) + '?tag=pep',
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
    if (!item) {
        return
    }
    try {
        if ('rich_text' in item) {
            return item.rich_text.map(rich_text => rich_text.plain_text).join('')
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
            return
        }
    } catch (e) {
        console.log(item, e)
        return
    }
}

module.exports.fetch = async (req, res) => {
    let result
    let resultPep
    try {
        result = await axios.post(`https://api.notion.com/v1/databases/${process.env.DATABASE}/query`, {
            filter: {
                property: "redaction_status",
                select: {
                    equals: "published"
                }
            }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.TOKEN}`,
                'Notion-Version': '2021-08-16'
            }
        })
        resultPep = await axios.post(`https://api.notion.com/v1/databases/${process.env.PEP_DATABASE}/query`, {
            filter: {
                property: "hide",
                checkbox: {
                    equals: false
                }
            }
        }, {
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
            ...resultPep.data.results.map(item => formatDetailFromPep(item))
        ],
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
}

module.exports.fetchDetail = async (req, res) => {

    let result
    const id = req.url.split('-').slice(-5).join('-').split('?')[0];
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
        job: req.query.tag === 'pep' ? formatDetailFromPep(result.data) : formatDetail(result.data),
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
}
