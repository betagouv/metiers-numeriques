import { REGIONS_AS_OPTIONS } from '@common/constants'
import { define } from '@common/helpers/define'
import { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { FilterRadio } from '../../atoms/FilterRadio'

import type { Profession } from '@prisma/client'

type Filter = {
  professionId?: string
  query?: string
  region?: string
}

type JobFilterBarProps = {
  isDisabled: boolean
  onChange: (filter: Filter) => void | Promise<void>
  professions: Profession[]
}

const FiltersBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  > label {
    height: 17.75vw;
    margin: 0 0 1vw;
    width: 17.75vw;
  }
  > label:nth-child(5n + 1) {
    margin-left: 0;
  }

  > label:last-child {
    margin-right: 0;
  }

  @media screen and (min-width: 1248px) {
    flex-wrap: nowrap;
    justify-content: space-between;

    > label {
      height: 7.5rem;
      width: 7.5rem;
    }
  }
`

export function JobFilterBar({ isDisabled, onChange, professions }: JobFilterBarProps) {
  const $regionSelect = useRef<HTMLSelectElement>(null)
  const $searchInput = useRef<HTMLInputElement>(null)
  const [selectedProfessionId, setSelectedProfessionId] = useState<string | undefined>()

  const handleChange = useCallback(({ professionId }: Filter) => {
    if ($searchInput.current === null || $regionSelect.current === null) {
      return
    }

    const query = define($searchInput.current.value)
    const region = define($regionSelect.current.value)

    onChange({ professionId, query, region })

    if (professionId !== undefined) {
      setSelectedProfessionId(professionId)
    }
  }, [])

  const selectProfessionId = useCallback((professionId: string) => {
    handleChange({ professionId })

    setSelectedProfessionId(professionId)
  }, [])

  const unselectProfessionId = useCallback(() => {
    handleChange({})

    setSelectedProfessionId(undefined)
  }, [])

  return (
    <>
      <div className="fr-grid-row">
        <div className="fr-col-12 fr-col-md-7">
          <label className="fr-label" htmlFor="JobsSearchInput">
            Métier
          </label>
          <div className="fr-input-wrap fr-mt-1w fr-fi-search-line">
            <input
              ref={$searchInput}
              className="fr-input"
              disabled={isDisabled}
              id="JobsSearchInput"
              onInput={() => handleChange({})}
              type="text"
            />
          </div>
        </div>

        <div className="fr-col-12 fr-pt-2w fr-col-md-5 fr-pt-md-0 fr-pl-md-2w">
          <label className="fr-label" htmlFor="JobsRegionSelect">
            Région
          </label>
          <div className="fr-input-wrap fr-mt-1w">
            <select ref={$regionSelect} className="fr-select" disabled={isDisabled} onChange={() => handleChange({})}>
              <option value="">Toutes</option>
              {REGIONS_AS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="fr-grid-row fr-py-2w">
        <div className="fr-col-12">
          <FiltersBox>
            {professions.map(profession => (
              <FilterRadio
                key={profession.id}
                defaultChecked={profession.id === selectedProfessionId}
                label={profession.name}
                name="professionId"
                onCheck={selectProfessionId}
                onUncheck={unselectProfessionId}
                value={profession.id}
              />
            ))}
          </FiltersBox>
        </div>
      </div>
    </>
  )
}
