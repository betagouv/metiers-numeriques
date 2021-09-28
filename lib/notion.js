var axios = require('axios');

exports.getPages = async (database) => {
    try {
        result = await axios.post(`https://api.notion.com/v1/databases/${database}/query`,null, {
            headers: {
                'Authorization': `Bearer ${process.env.TOKEN}`,
                'Notion-Version': '2021-08-16'
            }
        })
    } catch(e) {
        console.log(e)
    }
}

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
        console.log(data)
        if (data.results.length) {
            return data.results[0]
        }
        return
    } catch(e) {
        console.log(e)
        throw new Error(e)
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
        console.log(e)
    }
}
