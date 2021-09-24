require('dotenv').config();
const axios = require('axios');
const Job = require('../entities');

const mapToJob = (rawJob) => {
    // + Name
    // Ce que vous ferez
    // Conditions particulières du poste
    // Contact
    // Date limite
    // + Expérience
    // Les plus du poste
    // + Localisation
    // + Ministère
    // + Mission
    // + Poste ouvert aux
    // Poste à pourvoir
    // Pour candidater
    // Pour en savoir plus
    // + Rémunération
    // Si vous avez des questions
    // Votre profil
    // + Équipe

    return new Job({
        id: rawJob.id,
        title: rawJob.properties.Name.title[0].text.content,
        mission: rawJob.properties['Mission'].rich_text[0]?.text.content || '',
        experience: rawJob.properties['Expérience'].multi_select.map(_ => _.name),
        location: rawJob.properties['Localisation'].multi_select.map(_ => _.name),
        department: rawJob.properties['Ministère'].multi_select.map(_ => _.name),
        openedToContractTypes: rawJob.properties['Poste ouvert aux'].multi_select.map(_ => _.name),
        salary: rawJob.properties['Rémunération'].rich_text[0]?.text.content || '',
        team: rawJob.properties['Équipe'].rich_text[0]?.text.content || ''
    });
};

module.exports.NotionJobsService = {
    async all() {
        const res = await axios.post(`https://api.notion.com/v1/databases/${process.env.NOTION_JOBS_DATABASE_ID}/query`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2021-08-16'
                }
            })
            .catch(function (error) {
                console.log('Request Error: ' + error);
            });

        return res.data.results.map(mapToJob);
    },

    async get(id) {
        const res = await axios.post(`https://api.notion.com/v1/databases/${process.env.NOTION_JOBS_DATABASE_ID}/query`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2021-08-16'
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        const job = res.data.results.find(j => j.id === id);
        return mapToJob(job);
    }
};
