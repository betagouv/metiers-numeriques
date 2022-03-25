import * as R from 'ramda'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import type { Profession } from '@prisma/client'

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

type ProfessionFilterProps = {
  onChange: (professionId: string | undefined) => void | Promise<void>
  professions: Profession[]
}

export function ProfessionFilter({ onChange, professions }: ProfessionFilterProps) {
  const [selectedProfessionId, setSelectedProfessionId] = useState<string | undefined>(undefined)

  const controlledProfessions = useMemo(() => {
    const foundOthersProfession = R.find<Profession>(R.propEq('name', 'Autres'))(professions)

    if (foundOthersProfession) {
      return [...R.reject(R.propEq('name', 'Autres'))(professions), foundOthersProfession]
    }

    return professions
  }, [professions])

  const handleChange = useCallback(
    (professionId: string) => {
      if (professionId === selectedProfessionId) {
        onChange(undefined)
        setSelectedProfessionId(undefined)

        return
      }

      onChange(professionId)
      setSelectedProfessionId(professionId)
    },
    [selectedProfessionId],
  )

  return (
    <List>
      {controlledProfessions.map(profession => (
        <div key={profession.id}>
          <Tag
            isChecked={profession.id === selectedProfessionId}
            onClick={() => handleChange(profession.id)}
            type="button"
          >
            <TagText>{profession.name}</TagText>
          </Tag>
        </div>
      ))}
    </List>
  )
}
