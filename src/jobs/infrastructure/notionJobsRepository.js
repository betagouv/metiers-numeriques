'use strict';

require('dotenv').config();
const axios = require('axios');
const { mapToJob } = require('./mappers');
const { createPepProperties } = require('../utils');

module.exports.NotionService = {
    async all() {
        const { data } = await axios.post(`https://api.notion.com/v1/databases/${process.env.NOTION_JOBS_DATABASE_ID}/query`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2021-08-16',
                },
            })
            .catch(function(error) {
                console.log('Request Error: ' + error);
            });

        return data.results.map(mapToJob);
    },

    async get(pageId) {
        const { data } = await axios.post(`https://api.notion.com/v1/databases/${process.env.NOTION_JOBS_DATABASE_ID}/query`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2021-08-16',
                },
            })
            .catch(function(error) {
                console.log(error);
            });

        const job = data.results.find(j => j.id === pageId);
        return mapToJob(job);
    },

    async getPage(database, pageId) {
        try {
            const { data } = await axios.post(`https://api.notion.com/v1/databases/${database}/query`, {
                filter: {
                    'property': 'OfferID',
                    'text': {
                        'equals': pageId,
                    },
                },
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2021-08-16',
                },
            });
            if (data.results.length) {
                return data.results[0];
            }
            return null;
        } catch (e) {
            console.error(e);
            throw new Error('Impossible de récupérer la page');
        }
    },

    async createPage(database, properties) {
        const pepProperties = createPepProperties(properties);
        try {
            const result = await axios.post(`https://api.notion.com/v1/pages`, {
                'parent': { 'database_id': database },
                'properties': pepProperties,
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2021-08-16',
                },
            });
        } catch (e) {
            console.error(e);
            throw new Error('Impossible de crééer une page');
        }
    },

};
