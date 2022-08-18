import { JobContractType } from '@prisma/client'

export type FilterProps = {
  contractTypes?: JobContractType[]
  domainIds?: string[]
  keyword?: string
  professionId?: string
  region?: string
  seniority?: string
}
