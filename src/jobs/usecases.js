'use strict';

const ListJobs = async ({jobsRepository}) => {
    return await jobsRepository.all();
};

const GetJob = async (id, {jobsRepository}) => {
    return await jobsRepository.get(id);
};

module.exports = {
    ListJobs,
    GetJob
};
