import { Timestamp } from './entities';

export interface JobDetailDTO {
    id: string
    title: string
    institution: MinistryDetailDTO
    mission: string
    tasks: string[]
    profile: string[]
    experiences: string[]
    locations: string[]
    openedToContractTypes: string[]
    salary: string
    team: string
    hiringProcess: string
    publicationDate: Date
    conditions: string[]
    teamInfo: string
    toApply: string
    more: string
    limitDate: Date | null
    advantages: string

    updatedAt: Timestamp
}

export interface MinistryDetailDTO {
    id: string;
    name: string
    description: string
}
