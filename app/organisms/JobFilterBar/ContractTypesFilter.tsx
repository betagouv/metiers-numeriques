import { Select } from '@app/atoms/Select'
import { JOB_CONTRACT_TYPES_AS_OPTIONS } from '@common/constants'
import * as R from 'ramda'
import { useCallback } from 'react'

import type { SelectOption } from '@app/atoms/Select'
import type { JobContractType } from '@prisma/client'

type ContractTypesFilterProps = {
  onChange: (contractTypes: JobContractType[]) => void | Promise<void>
}

export function ContractTypesFilter({ onChange }: ContractTypesFilterProps) {
  const handleChange = useCallback((contractTypesAsOptions: Array<SelectOption<JobContractType>>) => {
    const contractTypes = contractTypesAsOptions.map(R.prop('value'))

    onChange(contractTypes)
  }, [])

  return (
    <Select
      isClearable
      isMulti
      label="Filtrer par domaine"
      name="profession"
      onChange={handleChange as any}
      options={JOB_CONTRACT_TYPES_AS_OPTIONS}
    />
  )
}
