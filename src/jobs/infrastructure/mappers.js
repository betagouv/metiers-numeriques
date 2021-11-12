const MarkdownIt = require('markdown-it');
const { startOfDay } = require('date-fns');
const { subDays } = require('date-fns');
const { Job, Ministry } = require('../entities');
const { toDate } = require('date-fns-tz');

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

const twoDaysAgo = subDays(startOfDay(new Date()), 2);

const buildSlug = (title, id) => {
    const slug = `${title}-${id}`.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    return slug
}

const mapToJob = (rawJob, now = Date.now()) => {
    // console.log(rawJob.properties['Name'])
    const title = parseProperty(rawJob.properties['Name'])
    const id = rawJob.id
    const md = new MarkdownIt();

    return new Job({
        id: rawJob.id,
        title,
        mission: md.renderInline(parseProperty(rawJob.properties['Mission'])),
        experiences: parseProperty(rawJob.properties['Expérience']),
        locations: parseProperty(rawJob.properties['Localisation']),
        department: parseProperty(rawJob.properties['Ministère']).map(a => md.renderInline(a)),
        openedToContractTypes: parseProperty(rawJob.properties['Poste ouvert aux']),
        salary: parseProperty(rawJob.properties['Rémunération']),
        team: parseProperty(rawJob.properties['Équipe']),
        limitDate: parseProperty(rawJob.properties['Date limite']) ? parseProperty(rawJob.properties['Date limite']) : undefined,
        toApply: md.renderInline(parseProperty(rawJob.properties['Pour candidater'])),
        advantages: parseProperty(rawJob.properties['Les plus du poste']),
        contact: md.renderInline(parseProperty(rawJob.properties['Contact']) || ''),
        profile: parseProperty(rawJob.properties['Votre profil']).split('- ').filter(item => item),
        conditions: parseProperty(rawJob.properties['Conditions particulières du poste']).split('- ').filter(item => item),
        teamInfo: md.renderInline(parseProperty(rawJob.properties['Si vous avez des questions'])),
        tasks: parseProperty(rawJob.properties['Ce que vous ferez']).split('- ').filter(item => item),
        slug: buildSlug(title, id),
        hiringProcess: md.renderInline(parseProperty(rawJob.properties['Processus de recrutement']) || '') || null,
        publicationDate: parseProperty(rawJob.properties['Date de saisie']) ? parseProperty(rawJob.properties['Date de saisie']) : twoDaysAgo,
    });
};

const mapToMinistry = (rawMinistry, now = Date.now()) => {
    const title = parseProperty(rawMinistry.properties['Titre'])
    const id = rawMinistry.id
    const md = new MarkdownIt();
    return new Ministry({
        id,
        title,
        fullName: parseProperty(rawMinistry.properties['Nom complet']),
        adress: parseProperty(rawMinistry.properties['Adresse']),
        adressBis: parseProperty(rawMinistry.properties['Adresse bis']),
        brandBlock: parseProperty(rawMinistry.properties['Bloc marque']),
        thumbnail: parseProperty(rawMinistry.properties['Vignette temporaire']),
        keyNumbers: md.render(parseProperty(rawMinistry.properties['Les chiffres clés'])),
        keyNumbersMedia: parseProperty(rawMinistry.properties['Les chiffres clés - liens']),
        missions: md.render(parseProperty(rawMinistry.properties['Les missions'])),
        projects: md.render(parseProperty(rawMinistry.properties['Les projets ou rélisations'])),
        projectsMedia: parseProperty(rawMinistry.properties['Projets ou réalisations compléments']),
        testimonials: md.render(parseProperty(rawMinistry.properties['Nos agents en parlent'])),
        testimonialsMedia: parseProperty(rawMinistry.properties['Liens Nos agents en parlent']),
        joinTeam: md.render(parseProperty(rawMinistry.properties['Nous rejoindre - Pourquoi?'])),
        joinTeamMedia: parseProperty(rawMinistry.properties['Nous rejoindre - Infos']),
        motivation: md.render(parseProperty(rawMinistry.properties["Raison d'être"])),
        motivationMedia: parseProperty(rawMinistry.properties["Raison d'être complément"]),
        profile: md.render(parseProperty(rawMinistry.properties['Ton profil'])),
        websites: parseProperty(rawMinistry.properties['Site(s) institutionel(s)']),
        jobsLink: parseProperty(rawMinistry.properties['Toutes les offres disponibles']),
        values: md.render(parseProperty(rawMinistry.properties['Valeurs'])),
        valuesMedia: parseProperty(rawMinistry.properties['Valeurs complément']),
        schedule: md.render(parseProperty(rawMinistry.properties['Agenda'])),
        socialNetworks: parseProperty(rawMinistry.properties['Réseaux sociaux']),
        visualBanner: parseProperty(rawMinistry.properties['Bandeau visuel']),
        challenges: md.render(parseProperty(rawMinistry.properties['Nos enjeux'])),
        organization: md.render(parseProperty(rawMinistry.properties['Notre organisation'])),
        organizationMedia: parseProperty(rawMinistry.properties['Notre organisation compléments']),
        hiringProcess: md.render(parseProperty(rawMinistry.properties['Processus de recrutement'])),
        slug: buildSlug(title, id),
        publicationDate: toDate("2021-09-13" + "T00:00:00+02:00", {timeZone: 'Europe/Paris'})
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
            // Some titles have multiple empty elements, haven't figured why
            return item.title.filter(item => item.plain_text)[0].plain_text;
        } else if ('email' in item) {
            return item.email[0].plain_text;
        } else if ('date' in item) {
            return toDate(item.date.start + "T00:00:00+02:00", {timeZone: 'Europe/Paris'})
        } else if ('files' in item) {
            return item.files;
        }
        else {
            return undefined
        }
    } catch (e) {
        return undefined
    }
};

module.exports = {
    mapToMinistry,
    mapToJob,
    formatDetailFromPep
}
