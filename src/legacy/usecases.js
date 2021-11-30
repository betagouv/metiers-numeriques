const listJobs = async ({ jobsRepository }, params) => jobsRepository.all(params)

const getJob = async (id, { jobsRepository }, tag) => jobsRepository.get(id, tag)

module.exports = {
  getJob,
  listJobs,
}
