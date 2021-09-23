const establishments = require('establishments.stub.json');
const jobDetail = require('jobDetail.stub.json');

module.exports.InMemoryJobsService = {
    async all() {
        return establishments;
    },

    async get(id) {
        return jobDetail;
    }
};
