import { Button } from '@app/atoms/Button'
import { ButtonX } from '@app/atoms/ButtonX'
import { Checkbox } from '@app/atoms/Checkbox'
import { TextInput } from '@app/atoms/TextInput'
import { DomainFilter } from '@app/organisms/JobFilterBar/DomainFilter'
import { Region } from '@common/constants'
import { define } from '@common/helpers/define'
import { Domain, JobRemoteStatus } from '@prisma/client'
import { FormEvent, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { ContractTypesFilter } from './ContractTypesFilter'
import { ProfessionFilter } from './ProfessionFilter'
import { RegionFilter } from './RegionFilter'

import type { JobContractType, Profession } from '@prisma/client'

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

export type Filter = {
  contractTypes: JobContractType[]
  domainIds: string[]
  professionIds: string[]
  query?: string | null
  region?: Region
  remoteStatuses: JobRemoteStatus[]
  seniorityInMonths?: number
}
export const INITIAL_FILTER: Filter = {
  contractTypes: [],
  domainIds: [],
  professionIds: [],
  remoteStatuses: [],
}

type JobFilterBarProps = {
  defaultQuery?: string | null
  domains: Pick<Domain, 'id' | 'name'>[]
  isModalOpen: boolean
  onChange: (filter: Filter) => void | Promise<void>
  onModalClose: () => void | Promise<void>
  professions: Pick<Profession, 'id' | 'name'>[]
}

export function JobFilterBar({
  defaultQuery,
  domains,
  isModalOpen,
  onChange,
  onModalClose,
  professions,
}: JobFilterBarProps) {
  const $filter = useRef<Filter>({
    ...INITIAL_FILTER,
    query: defaultQuery,
  })

  const handleContractTypes = useCallback((contractType?: JobContractType) => {
    $filter.current.contractTypes = contractType ? [contractType] : []

    onChange($filter.current)
  }, [])

  const handleProfessionIds = useCallback((professionIds: string[]) => {
    $filter.current.professionIds = professionIds

    onChange($filter.current)
  }, [])

  const handleDomainIds = useCallback((domainIds: string[]) => {
    $filter.current.domainIds = domainIds

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

  const handleSeniority = useCallback((isJuniorAccepted: boolean) => {
    $filter.current.seniorityInMonths = isJuniorAccepted ? 0 : undefined

    onChange($filter.current)
  }, [])

  const handleRemoteStatuses = useCallback((isRemoteAllowed: boolean) => {
    $filter.current.remoteStatuses = isRemoteAllowed ? [JobRemoteStatus.FULL, JobRemoteStatus.PARTIAL] : []

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

      <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-mb-md-0 fr-mb-4v">
        <div className="fr-col-md-4 fr-col-12">
          <TextInput
            aria-label="Mot-clé"
            // TODO: fix this weird null/undefined problem
            defaultValue={defaultQuery || undefined}
            name="query"
            onInput={handleQuery}
            placeholder="Rechercher par mot-clé"
          />
        </div>
        <div className="fr-col-md-3 fr-col-offset-md-1 fr-col-6">
          <Checkbox label="Ouvert aux juniors" name="seniorityInMonths" onChange={handleSeniority} />
        </div>
        <div className="fr-col-md-3 fr-col-6">
          <Checkbox label="Télétravail possible" name="remoteStatus" onChange={handleRemoteStatuses} />
        </div>
      </div>

      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-md-3 fr-col-12">
          <ProfessionFilter onChange={handleProfessionIds} professions={professions} />
        </div>
        <div className="fr-col-md-3 fr-col-12">
          <DomainFilter domains={domains} onChange={handleDomainIds} />
        </div>
        <div className="fr-col-md-3 fr-col-12">
          <RegionFilter onChange={handleRegion as any} />
        </div>
        <div className="fr-col-md-3 fr-col-12">
          <ContractTypesFilter onChange={handleContractTypes} />
        </div>
      </div>

      <div className="fr-mt-2w rf-text-right rf-hidden-md">
        <Button onClick={() => onModalClose()}>Appliquer</Button>
      </div>
    </Box>
  )
}
