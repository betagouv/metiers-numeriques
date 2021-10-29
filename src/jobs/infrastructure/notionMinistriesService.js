'use strict';

const axios = require('axios');
const { mapToMinistry } = require('./mappers');
require('dotenv').config();


module.exports.NotionMinistriesService = {
    async all({ startCursor, pageSize = 20 } = {}) {
        let ministries;
        let nextCursor;
        if (!startCursor) {
            const { data } = await axios.post(
                `https://api.notion.com/v1/databases/${process.env.NOTION_MINISTRIES_DATABASE_ID}/query`,
                {
                    start_cursor: startCursor,
                    page_size: pageSize,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                        'Notion-Version': '2021-08-16',
                    },
                })
                .catch(function(error) {
                    console.log('Request Error: ' + error);
                });
            ministries = data.results.map(mapToMinistry);
            nextCursor = data.next_cursor;
        }
        return {
            ministries,
            nextCursor
        }
    },

    async getMinistry(id) {
        try {
            const { data }  = await axios.get(`https://api.notion.com/v1/pages/${id}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2021-08-16',
                },
            }).catch(function(error) {
                console.log('Request Error: ' + error);
            });
            return  mapToMinistry(data);
        } catch (err) {
            console.log(err);
        } 
        return null;
    },
};
