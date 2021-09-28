var axios = require('axios');

exports.getPage = async (database, pageId) => {
    try {
        const { data } = await axios.post(`https://api.notion.com/v1/databases/${database}/query`, {
            filter: {
                "property": "OfferID",
                "text": {
                    "equals": pageId
                }
            }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.TOKEN}`,
                'Notion-Version': '2021-08-16'
            }
        })
        if (data.results.length) {
            return data.results[0]
        }
        return
    } catch(e) {
        console.error(e)
        throw new Error('Impossible de récupérer la page', e)
    }
}

exports.createPage = async (database, properties) => {
    try {
        result = await axios.post(`https://api.notion.com/v1/pages`, {
            "parent": { "database_id": database },
            "properties": properties,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.TOKEN}`,
                'Notion-Version': '2021-08-16'
            }
        })
    } catch(e) {
        console.error(e)
        throw new Error('Impossible de crééer une page', e)
    }
}
