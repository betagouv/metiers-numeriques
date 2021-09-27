'use strict';

require('dotenv').config();
const axios = require('axios');
const Job = require('../entities');

const mapToJob = (rawJob) => {
    return new Job({
        id: rawJob.id,
        title: rawJob.properties.Name.title[0].text.content,
        mission: parseProperty(rawJob.properties['Mission']),
        experiences: parseProperty(rawJob.properties['Expérience']),
        location: parseProperty(rawJob.properties['Localisation']),
        department: parseProperty(rawJob.properties['Ministère']),
        openedToContractTypes: parseProperty(rawJob.properties['Poste ouvert aux']),
        salary: parseProperty(rawJob.properties['Rémunération']),
        team: parseProperty(rawJob.properties['Équipe']),
        limitDate: parseProperty(rawJob.properties['Date limite']),
        toApply: parseProperty(rawJob.properties['Pour candidater']),
        advantages: parseProperty(rawJob.properties['Les plus du poste']),
        contact: parseProperty(rawJob.properties['Contact']),
        profile: parseProperty(rawJob.properties['Votre profil']),
        conditions: parseProperty(rawJob.properties['Conditions particulières du poste']),
        teamInfo: parseProperty(rawJob.properties['Si vous avez des questions']),
        tasks: parseProperty(rawJob.properties['Ce que vous ferez']).split('- ').filter(item => item),
        objectives: parseProperty(rawJob.properties['Objectifs']).split('- ').filter(item => item),
    });
};

const parseProperty = (data) => {
    try {
        if ('rich_text' in data) {
            return (data.rich_text[0] || {}).plain_text || '';
        } else if ('multi_select' in data) {
            return data.multi_select.map(item => item.name);
        } else if ('email' in data && data.email) {
            return data.email[0].plain_text;
        } else if ('date' in data && data.date) {
            return data.date.start;
        }
        return '';
    } catch (error) {
        console.log(error);
        return '';
    }
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
