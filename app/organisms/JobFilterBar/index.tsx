import { ButtonX } from '@app/atoms/ButtonX'
import { Region } from '@common/constants'
import { define } from '@common/helpers/define'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'
import { ChevronDown, ChevronLeft } from 'react-feather'
import styled from 'styled-components'

import { ContractTypesFilter } from './ContractTypesFilter'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { InstitutionsFilter } from './InstitutionsFilter'
import { ProfessionFilter } from './ProfessionFilter'
import { RegionFilter } from './RegionFilter'
import { RemoteStatusesFilter } from './RemoteStatusesFilter'

import type { Institution, JobContractType, JobRemoteStatus, Profession } from '@prisma/client'
import type { ID } from 'react-accessible-accordion/dist/types/components/ItemContext'

const Box = styled.div<{
  isModalOpen: boolean
}>`
  @media screen and (max-width: 767px) {
    background-color: var(--info-950-100);
    bottom: 0;
    display: ${p => (p.isModalOpen ? 'block' : 'none')};
    left: 0;
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 3;
  }

  input[type='text'] {
    background-color: white;
    border-radius: 0;
  }

  button.fr-btn {
    background-color: #0078f3;

    :hover {
      background-color: #6196ff;
    }
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

const StyledAccordionItemButton = styled(AccordionItemButton)`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
`
const Title = styled.h5`
  font-size: 110%;
  line-height: 1.5;
  margin: 0;
  padding-bottom: 0.25rem;
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
  const $searchInput = useRef<HTMLInputElement>(null)
  const $filter = useRef<Filter>({ ...INITIAL_FILTER })
  const [openedAccordionFilters, setOpenedAccordionFilters] = useState<ID[]>([INITIAL_ACCORDION_FILTER])

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

  const handleQuery = useCallback(() => {
    if ($searchInput.current === null) {
      return
    }

    $filter.current.query = define($searchInput.current.value)

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
    <Box className="fr-p-4w fr-p-md-0 fr-pl-md-4w fr-pt-md-3w" isModalOpen={isModalOpen}>
      <DialogHeader className="fr-grid-row fr-pb-1w fr-mb-2w rf-hidden-md-flex">
        <div className="fr-col-8">
          <DialogTitle>Filtres</DialogTitle>
        </div>
        <div className="fr-col-4 rf-text-right">
          <ButtonX onClick={() => onModalClose()} />
        </div>
      </DialogHeader>

      <div className="fr-input-wrap fr-fi-search-line">
        <input
          ref={$searchInput}
          className="fr-input"
          id="JobsSearchInput"
          onInput={handleQuery}
          placeholder="Rechercher un titre d’offre"
          type="text"
        />
      </div>

      <Accordion allowZeroExpanded onChange={setOpenedAccordionFilters} preExpanded={[INITIAL_ACCORDION_FILTER]}>
        <AccordionItem uuid="professionIdFilter">
          <AccordionItemHeading>
            <StyledAccordionItemButton className="fr-mt-4w">
              <Title>Secteur d’activité</Title>
              {openedAccordionFilters.includes('professionIdFilter') ? <ChevronDown /> : <ChevronLeft />}
            </StyledAccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <ProfessionFilter onChange={handleProfessionId as any} professions={professions} />
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid="regionFilter">
          <AccordionItemHeading>
            <StyledAccordionItemButton className="fr-mt-4w">
              <Title>Région</Title>
              {openedAccordionFilters.includes('regionFilter') ? <ChevronDown /> : <ChevronLeft />}
            </StyledAccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <RegionFilter onChange={handleRegion as any} />
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid="contractTypesFilter">
          <AccordionItemHeading>
            <StyledAccordionItemButton className="fr-mt-4w">
              <Title>Contrats</Title>
              {openedAccordionFilters.includes('contractTypesFilter') ? <ChevronDown /> : <ChevronLeft />}
            </StyledAccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <ContractTypesFilter onChange={handleContractTypes} />
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid="remoteStatusesFilter">
          <AccordionItemHeading>
            <StyledAccordionItemButton className="fr-mt-4w">
              <Title>Télétravail</Title>
              {openedAccordionFilters.includes('remoteStatusesFilter') ? <ChevronDown /> : <ChevronLeft />}
            </StyledAccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <RemoteStatusesFilter onChange={handleRemoteStatuses} />
          </AccordionItemPanel>
        </AccordionItem>

        {/* <AccordionItem uuid="institutionIdsFilter">
          <AccordionItemHeading>
            <StyledAccordionItemButton className="fr-mt-4w">
              <Title>Institutions</Title>
              {openedAccordionFilters.includes('institutionIdsFilter') ? <ChevronDown /> : <ChevronLeft />}
            </StyledAccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <InstitutionsFilter institutions={institutions} onChange={handleInstitutionIds} />
          </AccordionItemPanel>
        </AccordionItem> */}
      </Accordion>

      <div className="fr-mt-2w rf-text-right rf-hidden-md">
        <button className="fr-btn" onClick={() => onModalClose()} type="button">
          Appliquer
        </button>
      </div>
    </Box>
  )
}
