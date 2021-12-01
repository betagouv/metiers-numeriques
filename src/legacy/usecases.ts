const listJobs = async ({ jobsRepository }: any, params?: any) => jobsRepository.all(params)

const getJob = async (id: string, { jobsRepository }: any, tag?: any) => jobsRepository.get(id, tag)

export default {
  getJob,
  listJobs,
}
