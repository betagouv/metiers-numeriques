'use strict';

const axios = require('axios');
const { mapToMinistry } = require('./mappers');
// const { listMinistries } = require('../jobs.controller');
require('dotenv').config();

// Fixme: Hardcoded for now, would need 3 Notions calls to get this list
const MINISTRIES = {
    'ANSSI': ['ANSSI', 'https://www.notion.so/ANSSI-5ae04a4301a3425cb00b486be96693a3'],
    'DILA': ['DILA', 'https://www.notion.so/DILA-6f739c7defb346a1877ac0f559368b0b'],
    'ARCEP': ['ARCEP', 'https://www.notion.so/ARCEP-ce8ffdef3e7b487eb1373b3f11f82db4'],
    'DINUM': ['DINUM', 'https://www.notion.so/DINUM-9bb821d86b3544999e78a1d19e4b41f0'],
    'SIC': ['SIC', 'https://www.notion.so/SIC-708295d80ad24a5dae4aeeee7a96a536'],
    'SNUM': ['SNUM', 'https://www.notion.so/SNUM-Justice-5876b2897e8b405d96eef47c1d538066'],
    'CNIL': ['CNIL', 'https://www.notion.so/CNIL-3b76aaad6b024b28a8cd631124fcd079'],
    'MEAE': ['Direction du numérique (MEAE)', 'https://www.notion.so/Direction-du-num-rique-MEAE-a880841f3e094ef18a73889127f7a534'],
    'DNUM': ['DNUM des ministères sociaux travail et emploi', 'https://www.notion.so/DNUM-des-minist-res-sociaux-travail-et-emploi-eb8042bd2b484f8eb00f10fc911c932d'],
    'DSI': ['DSI services du 1er Ministre', 'https://www.notion.so/DSI-services-du-1er-Ministre-4460809a5b424fe283eb434faabe99c3'],
    'SDI': ['SDI Bercy', 'https://www.notion.so/SDI-Bercy-28bb46ded8b646189564be45ab681980'],
    'SNUMC': ['SNUM Culture', 'https://www.notion.so/SNUM-Culture-d944df379030434284ac4faf6a30b37d'],
};

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

    async listMinistries() {
        // // Récupère la liste des ministères en premier
        // const { data } = await axios.get(`https://api.notion.com/v1/blocks/f2d24c7329454cf9b3bcbc3c8a49a294/children`, {
        //     headers: {
        //         'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        //         'Notion-Version': '2021-08-16',
        //     },
        // });
        // const dataWithoutUselessBlocks = data.results.filter(m => m.has_children);
        return MINISTRIES;
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
            console.log("Test min", mapToMinistry(data));
            return  mapToMinistry(data);
        } catch (err) {
            console.log(err);
        } 
        return null;
    },
};
