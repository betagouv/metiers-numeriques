import { JOB_REMOTE_STATUS_LABEL } from '@common/constants'
import * as R from 'ramda'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

import type { JobRemoteStatus } from '@prisma/client'

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

type RemoteStatusesFilterProps = {
  onChange: (contractTypes: JobRemoteStatus[]) => void | Promise<void>
}

export function RemoteStatusesFilter({ onChange }: RemoteStatusesFilterProps) {
  const [selectedRemoteStatuses, setSelectedRemoteStatuses] = useState<JobRemoteStatus[]>([])

  const handleChange = useCallback(
    (contractType: JobRemoteStatus) => {
      const newSelectedRemoteStatuses = selectedRemoteStatuses.includes(contractType)
        ? R.reject(R.equals(contractType), selectedRemoteStatuses)
        : [...selectedRemoteStatuses, contractType]

      onChange(newSelectedRemoteStatuses)

      setSelectedRemoteStatuses(newSelectedRemoteStatuses)
    },
    [selectedRemoteStatuses],
  )

  return (
    <div>
      {R.toPairs(JOB_REMOTE_STATUS_LABEL).map(([key, label]) => (
        <Tag
          key={key}
          className="fr-tag"
          isChecked={selectedRemoteStatuses.includes(key)}
          onClick={() => handleChange(key)}
        >
          {label}
        </Tag>
      ))}
    </div>
  )
}
