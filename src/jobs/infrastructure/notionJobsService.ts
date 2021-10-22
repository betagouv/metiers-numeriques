import { JobDetailDTO } from '../entities';
import { JobsService } from '../types';

require('dotenv').config();
const axios = require('axios');
const { mapToJob, formatDetailFromPep } = require('./mappers');
const { createPepProperties } = require('../utils');

export const NotionService: JobsService = {
    async all({
                  startCursor = '',
                  pageSize = 20,
              }): Promise<{ jobs: JobDetailDTO[]; hasMore: string; nextCursor: string; }> {
        let jobs = [];
        let jobsPep = [];
        let nextCursor;
        let hasMore;
        if (!startCursor || !startCursor.startsWith('pep-')) {
            const { data } = await axios.post(
                `https://api.notion.com/v1/databases/${process.env.NOTION_JOBS_DATABASE_ID}/query`,
                {
                    // const {InMemoryJobsService} = require('./infrastructure/InMemoryJobsRepository');
                    filter: {
                        property: 'redaction_status',
                        select: {
                            equals: 'published',
                        },
                    },
                    start_cursor: startCursor,
                    page_size: pageSize,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                        'Notion-Version': '2021-08-16',
                    },
                })
                .catch((error: any) => {
                    console.log('Request Error: ' + error);
                });
            jobs = data.results.map(mapToJob);
            nextCursor = data.next_cursor;
        }
        if (jobs.length < 20) {
            const start_pep_cursor = startCursor && startCursor.startsWith('pep-') ? startCursor.replace('pep-', '') : undefined;
            const { data } = await axios.post(`https://api.notion.com/v1/databases/${process.env.PEP_DATABASE_ID}/query`, {
                filter: {
                    property: 'hide',
                    checkbox: {
                        equals: false,
                    },
                },
                start_cursor: start_pep_cursor,
                page_size: 20 - jobs.length,
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2021-08-16',
                },
            });
            jobsPep = data.results.map((item: any) => formatDetailFromPep(item));
            nextCursor = 'pep-' + data.next_cursor;
            hasMore = data.has_more;
        }

        return {
            jobs: [
                ...jobs,
                ...jobsPep,
            ],
            hasMore,
            nextCursor,
        };
        // return data.results.map(mapToJob);
    },

    async count() {
        let { data } = await axios.post(
            `https://api.notion.com/v1/databases/${process.env.NOTION_JOBS_DATABASE_ID}/query`,
            {
                filter: {
                    property: 'redaction_status',
                    select: {
                        equals: 'published',
                    },
                },
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2021-08-16',
                },
            })
            .catch((error: any) => {
                console.log('Request Error: ' + error);
            });
        const count = data.results.length;

        const { data: pepData } = await axios.post(`https://api.notion.com/v1/databases/${process.env.PEP_DATABASE_ID}/query`, {
            filter: {
                property: 'hide',
                checkbox: {
                    equals: false,
                },
            },
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                'Notion-Version': '2021-08-16',
            },
        });
        const countPep = pepData.results.length;

        return count + countPep;
    },

    async get(pageId: string, tag: string) {
        let mapper = tag === 'pep' ? formatDetailFromPep : mapToJob;
        let result;
        try {
            result = await axios.get(`https://api.notion.com/v1/pages/${pageId}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2021-08-16',
                },
            });

        } catch (e) {
            console.log(e);
        }

        if (result) {
            return mapper(result.data);
        }
        return null;
    },

    async getPage(database: string, pageId: string) {
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

    async createPage(database: string, properties: any) {
        const pepProperties = createPepProperties(properties);
        try {
            await axios.post(`https://api.notion.com/v1/pages`, {
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
