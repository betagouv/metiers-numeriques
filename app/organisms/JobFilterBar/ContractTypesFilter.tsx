import { JOB_CONTRACT_TYPE_LABEL } from '@common/constants'
import * as R from 'ramda'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

import type { JobContractType } from '@prisma/client'

const Tag = styled.span<{
  isChecked: boolean
}>`
  background-color: ${p => (p.isChecked ? '#6798ff' : 'white')};
  color: ${p => (p.isChecked ? 'white' : 'black')};
  cursor: pointer;
  margin: 0 1rem 1rem 0;

  :hover {
    background-color: ${p => (p.isChecked ? 'red' : '#3b87ff')};
    color: white;
  }
`

type ContractTypesFilterProps = {
  onChange: (contractTypes: JobContractType[]) => void | Promise<void>
}

export function ContractTypesFilter({ onChange }: ContractTypesFilterProps) {
  const [selectedContractTypes, setSelectedContractTypes] = useState<JobContractType[]>([])

  const handleChange = useCallback(
    (contractType: JobContractType) => {
      const newSelectedContractTypes = selectedContractTypes.includes(contractType)
        ? R.reject(R.equals(contractType), selectedContractTypes)
        : [...selectedContractTypes, contractType]

      onChange(newSelectedContractTypes)

      setSelectedContractTypes(newSelectedContractTypes)
    },
    [selectedContractTypes],
  )

  return (
    <div>
      {R.toPairs(JOB_CONTRACT_TYPE_LABEL).map(([key, label]) => (
        <Tag
          key={key}
          className="fr-tag"
          isChecked={selectedContractTypes.includes(key)}
          onClick={() => handleChange(key)}
        >
          {label}
        </Tag>
      ))}
    </div>
  )
}
