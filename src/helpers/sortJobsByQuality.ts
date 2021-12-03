import Job from '../models/Job'

export default function sortJobsByQuality(jobs: Job[]): Job[] {
  return jobs.sort((jobA, jobB) => {
    if (jobA.reference.startsWith('MNN')) {
      if (jobB.reference.startsWith('MNN')) {
        return 0
      }

      return -1
    }

    if (jobA.reference.startsWith('PEP')) {
      if (jobB.reference.startsWith('MNN')) {
        return 1
      }

      if (jobB.reference.startsWith('PEP')) {
        return 0
      }

      return -1
    }

    if (jobA.reference.startsWith('SKB')) {
      if (jobB.reference.startsWith('MNN') || jobB.reference.startsWith('PEP')) {
        return 1
      }

      if (jobB.reference.startsWith('SKB')) {
        return 0
      }

      return -1
    }

    if (jobB.reference.startsWith('MNN') || jobB.reference.startsWith('PEP') || jobB.reference.startsWith('SKB')) {
      return 1
    }

    return 0
  })
}
