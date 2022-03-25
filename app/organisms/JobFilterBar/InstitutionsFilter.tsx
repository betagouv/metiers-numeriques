import * as R from 'ramda'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

import type { Institution } from '@prisma/client'

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  > div {
    margin-top: 1rem;
    width: 50%;
  }
  > div:nth-child(even) {
    padding-left: 1rem;
  }
  > div:nth-child(1),
  > div:nth-child(2) {
    margin-top: 0;
  }
`

const Tag = styled.button<{
  isChecked: boolean
}>`
  align-items: center;
  background-color: ${p => (p.isChecked ? '#6798ff' : 'white')};
  color: ${p => (p.isChecked ? 'white' : 'inherit')};
  cursor: pointer;
  display: inline-flex;
  font-size: 80%;
  justify-content: center;
  padding: 0.65rem 0 0.85rem;
  text-align: center;
  user-select: none;
  width: 100%;

  :hover {
    background-color: ${p => (p.isChecked ? 'red' : '#3b87ff')};
    color: white;
  }
`

const TagText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`

type InstitutionsFilterProps = {
  institutions: Institution[]
  onChange: (insitutionIds: string[]) => void | Promise<void>
}

export function InstitutionsFilter({ institutions, onChange }: InstitutionsFilterProps) {
  const [selectedInstitutionIds, setSelectedInstitutionIds] = useState<string[]>([])

  const handleChange = useCallback(
    (institutionId: string) => {
      const newSelectedInstitutionIds = selectedInstitutionIds.includes(institutionId)
        ? R.reject(R.equals(institutionId), selectedInstitutionIds)
        : [...selectedInstitutionIds, institutionId]

      onChange(newSelectedInstitutionIds)

      setSelectedInstitutionIds(newSelectedInstitutionIds)
    },
    [selectedInstitutionIds],
  )

  return (
    <List>
      {institutions.map(institution => (
        <div key={institution.id}>
          <Tag
            isChecked={selectedInstitutionIds.includes(institution.id)}
            onClick={() => handleChange(institution.id)}
            type="button"
          >
            <TagText>{institution.name}</TagText>
          </Tag>
        </div>
      ))}
    </List>
  )
}
