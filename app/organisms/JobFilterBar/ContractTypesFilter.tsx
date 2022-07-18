import { Select } from '@app/atoms/Select'
import { JOB_CONTRACT_TYPES_AS_OPTIONS } from '@common/constants'
import { useCallback } from 'react'

import type { SelectOption } from '@app/atoms/Select'
import type { JobContractType } from '@prisma/client'

type ContractTypesFilterProps = {
  onChange: (contractType?: JobContractType) => void
}

export function ContractTypesFilter({ onChange }: ContractTypesFilterProps) {
  const handleChange = useCallback((contractTypeAsOption: SelectOption<JobContractType>) => {
    onChange(contractTypeAsOption ? contractTypeAsOption.value : undefined)
  }, [])

  return (
    <Select
      isClearable
      label="Filtrer par contrat"
      name="profession"
      onChange={handleChange as any}
      options={JOB_CONTRACT_TYPES_AS_OPTIONS}
    />
  )
}
