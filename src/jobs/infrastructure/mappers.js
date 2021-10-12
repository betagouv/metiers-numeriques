const Job = require('../entities');
const { toDate } = require('date-fns-tz');

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

const buildSlug = (title, id) => {
    const slug = `${title}-${id}`.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    return slug
}

const mapToJob = (rawJob, now = Date.now()) => {
    const title = parseProperty(rawJob.properties['Name'])
    const id = rawJob.id
    return new Job({
        id: rawJob.id,
        title,
        mission: parseProperty(rawJob.properties['Mission']),
        experiences: parseProperty(rawJob.properties['Expérience']),
        locations: parseProperty(rawJob.properties['Localisation']),
        department: parseProperty(rawJob.properties['Ministère']),
        openedToContractTypes: parseProperty(rawJob.properties['Poste ouvert aux']),
        salary: parseProperty(rawJob.properties['Rémunération']),
        team: parseProperty(rawJob.properties['Équipe']),
        limitDate: parseProperty(rawJob.properties['Date limite']) ? parseProperty(rawJob.properties['Date limite']) : undefined,
        toApply: parseProperty(rawJob.properties['Pour candidater']),
        advantages: parseProperty(rawJob.properties['Les plus du poste']),
        contact: parseProperty(rawJob.properties['Contact']),
        profile: parseProperty(rawJob.properties['Votre profil']).split('- ').filter(item => item),
        conditions: parseProperty(rawJob.properties['Conditions particulières du poste']).split('- ').filter(item => item),
        teamInfo: parseProperty(rawJob.properties['Si vous avez des questions']),
        tasks: parseProperty(rawJob.properties['Ce que vous ferez']).split('- ').filter(item => item),
        slug: buildSlug(title, id),
        hiringProcess: parseProperty(rawJob.properties['Processus de recrutement']),
    });
};

const formatDetailFromPep = (job) => {
    const item = job.properties
    const title = parseProperty(item.Name)
    const id = job.id
    return new Job({
        id,
        title,
        mission: urlify(parseProperty(item.JobDescriptionTranslation_Description1_) || ''),
        experiences: parseProperty(item.ApplicantCriteria_EducationLevel_) ? [parseProperty(item.ApplicantCriteria_EducationLevel_)] : [],
        locations: [(parseProperty(item.Location_JobLocation_) || '').replace('- -', '')],
        department: [parseProperty(item.Origin_Entity_)],
        openedToContractTypes: parseProperty(item.JobDescription_Contract_) ? [parseProperty(item.JobDescription_Contract_)] : [],
        salary: undefined,
        team: '',
        limitDate: '',
        toApply: parseProperty(item.Origin_CustomFieldsTranslation_ShortText1_),
        advantages: '',
        contact: parseProperty(item.Origin_CustomFieldsTranslation_ShortText2_),
        profile: [parseProperty(item.JobDescriptionTranslation_Description2_)],
        conditions: [],
        teamInfo: '',
        tasks: undefined,
        more: urlify(`https://place-emploi-public.gouv.fr/offre-emploi/${parseProperty(item.Offer_Reference_)}/`),
        publicationDate: (parseProperty(item.FirstPublicationDate) ||'').split(' ')[0],
        slug: buildSlug(title, id) + '?tag=pep',
    })
}

const parseProperty = (item) => {
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
            return toDate(item.date.start + "T00:00:00+02:00", {timeZone: 'Europe/Paris'})
        }
        else {
            return undefined
        }
    } catch (e) {
        return undefined
    }
};

module.exports = {
    mapToJob,
    formatDetailFromPep
}
