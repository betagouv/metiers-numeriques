import { Button } from '@app/atoms/Button'
import { ButtonX } from '@app/atoms/ButtonX'
import { TextInput } from '@app/atoms/TextInput'
import { Region } from '@common/constants'
import { define } from '@common/helpers/define'
import { FormEvent, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { ContractTypesFilter } from './ContractTypesFilter'
import { ProfessionFilter } from './ProfessionFilter'
import { RegionFilter } from './RegionFilter'
import { RemoteStatusesFilter } from './RemoteStatusesFilter'

import type { Institution, JobContractType, JobRemoteStatus, Profession } from '@prisma/client'

const Box = styled.div<{
  isModalOpen: boolean
}>`
  margin: 3rem 0 0 0;

  @media screen and (max-width: 767px) {
    background-color: var(--info-950-100);
    bottom: 0;
    display: ${p => (p.isModalOpen ? 'block' : 'none')};
    left: 0;
    margin: 0;
    overflow-y: auto;
    padding: 1rem;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 3000;
  }
`

const DialogHeader = styled.div`
  border-bottom: 1px solid #666666;
`

const DialogTitle = styled.h4`
  font-size: 120%;
  line-height: 1;
  margin: 0;
`

const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;

  > div:not(:first-child) {
    margin: 1rem 0 0 0;
  }

  @media screen and (min-width: 768px) {
    flex-direction: row;

    > div {
      flex-grow: 1;
    }
    > div:not(:first-child) {
      margin: 0 0 0 1rem;
    }
  }
`

export type Filter = {
  contractTypes: JobContractType[]
  institutionIds: string[]
  professionId: string | undefined
  query: string | undefined
  region: Region | undefined
  remoteStatuses: JobRemoteStatus[]
}
export const INITIAL_FILTER: Filter = {
  contractTypes: [],
  institutionIds: [],
  professionId: undefined,
  query: undefined,
  region: undefined,
  remoteStatuses: [],
}

export const INITIAL_ACCORDION_FILTER: string = 'professionIdFilter'

type JobFilterBarProps = {
  institutions: Institution[]
  isModalOpen: boolean
  onChange: (filter: Filter) => void | Promise<void>
  onModalClose: () => void | Promise<void>
  professions: Profession[]
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function JobFilterBar({ institutions, isModalOpen, onChange, onModalClose, professions }: JobFilterBarProps) {
  const $filter = useRef<Filter>({ ...INITIAL_FILTER })

  const handleContractTypes = useCallback((contractTypes: JobContractType[]) => {
    $filter.current.contractTypes = contractTypes

    onChange($filter.current)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleInstitutionIds = useCallback((institutionIds: string[]) => {
    $filter.current.institutionIds = institutionIds

    onChange($filter.current)
  }, [])

  const handleProfessionId = useCallback((professionId: string) => {
    $filter.current.professionId = professionId

    onChange($filter.current)
  }, [])

  const handleQuery = useCallback((event: FormEvent<HTMLInputElement>) => {
    $filter.current.query = define(event.currentTarget.value)

    onChange($filter.current)
  }, [])

  const handleRegion = useCallback((region: Region) => {
    $filter.current.region = region

    onChange($filter.current)
  }, [])

  const handleRemoteStatuses = useCallback((remoteStatuses: JobRemoteStatus[]) => {
    $filter.current.remoteStatuses = remoteStatuses

    onChange($filter.current)
  }, [])

  useEffect(
    () => () => {
      onChange(INITIAL_FILTER)
    },
    [],
  )

  return (
    <Box isModalOpen={isModalOpen}>
      <DialogHeader className="fr-grid-row fr-pb-1w fr-mb-2w rf-hidden-md-flex">
        <div className="fr-col-8">
          <DialogTitle>Filtres</DialogTitle>
        </div>
        <div className="fr-col-4 rf-text-right">
          <ButtonX onClick={() => onModalClose()} />
        </div>
      </DialogHeader>

      <TextInput aria-label="Mot-clé" name="query" onInput={handleQuery} placeholder="Rechercher par mot-clé" />

      <FilterList>
        <ProfessionFilter onChange={handleProfessionId as any} professions={professions} />
        <RegionFilter onChange={handleRegion as any} />
        <ContractTypesFilter onChange={handleContractTypes} />
        <RemoteStatusesFilter onChange={handleRemoteStatuses} />
      </FilterList>

      <div className="fr-mt-2w rf-text-right rf-hidden-md">
        <Button onClick={() => onModalClose()}>Appliquer</Button>
      </div>
    </Box>
  )
}
