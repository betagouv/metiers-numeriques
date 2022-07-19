import { AdminForm } from '@app/molecules/AdminForm'
import { DomainSelect } from '@app/molecules/AdminForm/DomainSelect'
import { ProfessionSelect } from '@app/molecules/AdminForm/ProfessionSelect'
import { Select } from '@app/molecules/AdminForm/Select'
import { TextInput } from '@app/molecules/AdminForm/TextInput'
import { Col, Row } from '@app/organisms/CandidatePool/Grid'
import { FilterProps } from '@app/organisms/CandidatePool/types'
import { JOB_CONTRACT_TYPES_AS_OPTIONS, REGIONS_AS_OPTIONS, SENIORITY_AS_OPTIONS } from '@common/constants'
import { JobContractType } from '@prisma/client'
import React, { useRef } from 'react'

export const CandidateFilters = ({ onFilter }) => {
  const filters = useRef<FilterProps>({})

  const handleChangeKeyword = (keyword?: string) => {
    filters.current.keyword = keyword
    onFilter(filters.current)
  }

  const handleChangeProfession = (professionId?: string) => {
    filters.current.professionId = professionId
    onFilter(filters.current)
  }

  const handleChangeDomains = (domainIds?: string[]) => {
    filters.current.domainIds = domainIds
    onFilter(filters.current)
  }

  const handleChangeContractTypes = (contractTypes?: JobContractType[]) => {
    filters.current.contractTypes = contractTypes
    onFilter(filters.current)
  }

  const handleChangeRegion = (region?: string) => {
    filters.current.region = region
    onFilter(filters.current)
  }

  const handleChangeSeniority = (seniority?: number) => {
    filters.current.seniority = seniority
    onFilter(filters.current)
  }

  return (
    <AdminForm initialValues={{}} onSubmit={onFilter}>
      <Row gap={0.5} style={{ alignItems: 'flex-end' }}>
        <Col size={25}>
          <TextInput
            label="Recherche par mot-clé"
            name="keyword"
            onChange={e => handleChangeKeyword(e.target.value)}
            placeholder="Développeur, chef de projet, ..."
          />
        </Col>
        <Col size={15}>
          <ProfessionSelect label="Compétence" name="professionId" onChange={handleChangeProfession} />
        </Col>

        <Col size={15}>
          <DomainSelect label="Domaines" name="domainIds" onChange={handleChangeDomains} />
        </Col>
        <Col size={15}>
          <Select
            isMulti
            label="Types de contrat"
            name="contractTypes"
            // @ts-ignore
            onChange={handleChangeContractTypes}
            options={JOB_CONTRACT_TYPES_AS_OPTIONS}
          />
        </Col>
        <Col size={15}>
          {/* @ts-ignore */}
          <Select label="Localisation" name="region" onChange={handleChangeRegion} options={REGIONS_AS_OPTIONS} />
        </Col>
        <Col size={15}>
          {/* @ts-ignore */}
          <Select label="Seniorité" name="seniority" onChange={handleChangeSeniority} options={SENIORITY_AS_OPTIONS} />
        </Col>
      </Row>
    </AdminForm>
  )
}
