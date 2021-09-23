require('dotenv').config();
const axios = require('axios');
const Job = require('../entities');

const mapToJobs = (rawJobs) => {
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

    return rawJobs.map(data => new Job({
        title: data.properties.Name.title[0].text.content,
        mission: data.properties["Mission"].rich_text[0]?.text.content ?? "",
        experience: data.properties["Expérience"].multi_select.map(_ => _.name),
        location: data.properties["Localisation"].multi_select.map(_ => _.name),
        department: data.properties["Ministère"].multi_select.map(_ => _.name),
        openedToContractTypes: data.properties["Poste ouvert aux"].multi_select.map(_ => _.name),
        salary: data.properties["Rémunération"].rich_text[0]?.text.content,
        team: data.properties["Équipe"].rich_text[0]?.text.content
    }))
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
                console.log(error);
            });

        return mapToJobs(res.data.results);
    },

    async get(id) {
        return await axios.post(`https://api.notion.com/v1/databases/${process.env.NOTION_JOBS_DATABASE_ID}/query`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.TOKEN}`,
                    'Notion-Version': '2021-08-16'
                }
            });
    }
};
