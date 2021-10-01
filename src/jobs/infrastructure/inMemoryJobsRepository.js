const establishments = require('../__tests__establishments.stub.json');
const jobDetail = require('../__tests__jobDetail.stub.json');

module.exports.InMemoryJobsService = {
    async all() {
        return establishments;
    },

    async get(id) {
        return jobDetail;
    }
};
