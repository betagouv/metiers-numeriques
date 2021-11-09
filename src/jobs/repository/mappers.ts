// import { toDate } from 'date-fns-tz';
// import { JobDetailDTO } from '../types';
//
//
// function urlify(text: string) {
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     return text.replace(urlRegex, (url) => {
//         return '<a href="' + url + '">' + url + '</a>';
//     });
//     // or alternatively
//     // return text.replace(urlRegex, '<a href="$1">$1</a>')
// }
//
// const buildSlug = (title: string, id: string) => {
//     return `${title}-${id}`.toLowerCase()
//         .normalize('NFD')
//         .replace(/[\u0300-\u036f]/g, '')
//         .replace(/ /g, '-')
//         .replace(/[^\w-]+/g, '');
// };
//
// const toDTO = (rawJob: any): JobDetailDTO => {
//     const title = parseProperty(rawJob.properties['Name']) as string;
//     const id: string = rawJob.id;
//     return {
//         id: rawJob.id,
//         title,
//         mission: parseProperty(rawJob.properties['Mission']),
//         experiences: parseProperty(rawJob.properties['Expérience']),
//         locations: parseProperty(rawJob.properties['Localisation']),
//         department: parseProperty(rawJob.properties['Ministère']),
//         openedToContractTypes: parseProperty(rawJob.properties['Poste ouvert aux']),
//         salary: parseProperty(rawJob.properties['Rémunération']),
//         team: parseProperty(rawJob.properties['Équipe']),
//         limitDate: parseProperty(rawJob.properties['Date limite']) ? parseProperty(rawJob.properties['Date limite']) : undefined,
//         toApply: parseProperty(rawJob.properties['Pour candidater']),
//         advantages: parseProperty(rawJob.properties['Les plus du poste']),
//         contact: parseProperty(rawJob.properties['Contact']),
//         profile: (parseProperty(rawJob.properties['Votre profil']) as string).split('- ').filter((item: string) => item),
//         conditions: (parseProperty(rawJob.properties['Conditions particulières du poste']) as string).split('- ').filter((item: string) => item),
//         teamInfo: parseProperty(rawJob.properties['Si vous avez des questions']),
//         tasks: (parseProperty(rawJob.properties['Ce que vous ferez']) as string).split('- ').filter((item: string) => item),
//         slug: buildSlug(title, id),
//         hiringProcess: parseProperty(rawJob.properties['Processus de recrutement']),
//         publicationDate: toDate('2021-09-13' + 'T00:00:00+02:00', { timeZone: 'Europe/Paris' }),
//         more: '',
//     } as JobDetailDTO;
// };
//
// const formatDetailFromPep = (job: any) => {
//     const item = job.properties;
//     const title = parseProperty(item.Name) as string;
//     const id: string = job.id;
//     return {
//         id,
//         title,
//         mission: urlify((parseProperty(item.JobDescriptionTranslation_Description1_) as string) || ''),
//         experiences: parseProperty(item.ApplicantCriteria_EducationLevel_) ? [parseProperty(item.ApplicantCriteria_EducationLevel_)] : [],
//         locations: [((parseProperty(item.Location_JobLocation_) as string) || '').replace('- -', '')],
//         department: [parseProperty(item.Origin_Entity_)],
//         openedToContractTypes: parseProperty(item.JobDescription_Contract_) ? [parseProperty(item.JobDescription_Contract_)] : [],
//         salary: '',
//         team: '',
//         toApply: parseProperty(item.Origin_CustomFieldsTranslation_ShortText1_),
//         advantages: '',
//         contact: parseProperty(item.Origin_CustomFieldsTranslation_ShortText2_),
//         profile: [parseProperty(item.JobDescriptionTranslation_Description2_)],
//         conditions: [],
//         teamInfo: '',
//         tasks: [],
//         more: urlify(`https://place-emploi-public.gouv.fr/offre-emploi/${parseProperty(item.Offer_Reference_)}/`),
//         // fixme
//         // publicationDate: ((parseProperty(item.FirstPublicationDate) as Date) || '').split(' ')[0],
//         slug: buildSlug(title, id) + '?tag=pep',
//         hiringProcess: '',
//     } as JobDetailDTO;
// };
//
// const parseProperty = (item: any): unknown => {
//     if (!item) {
//         return;
//     }
//     try {
//         if ('rich_text' in item) {
//             return item.rich_text.map((rich_text: any) => rich_text.plain_text).join('') as string;
//         } else if ('multi_select' in item) {
//             return item.multi_select.map((item: any) => item.name) as string;
//         } else if ('title' in item) {
//             return item.title[0].plain_text as string;
//         } else if ('email' in item) {
//             return item.email[0].plain_text as string;
//         } else if ('date' in item) {
//             return toDate(item.date.start + 'T00:00:00+02:00', { timeZone: 'Europe/Paris' });
//         } else {
//             return undefined;
//         }
//     } catch (e) {
//         return undefined;
//     }
// };
//
// export {
//     mapToJob,
//     formatDetailFromPep,
// };
