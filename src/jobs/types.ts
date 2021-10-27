export interface JobDetailDTO {
    id: string
    title: string
    mission?: string
    tasks?: string[]
    profile?: string[]
    experiences?: string[]
    locations?: string[]
    department?: string[]
    openedToContractTypes?: string[]
    salary?: string
    team?: string
    slug?: string
    hiringProcess?: string
    publicationDate?: Date
    conditions?: string[]
    teamInfo?: string
    toApply?: string
    more?: string
    limitDate?: Date
    advantages?: string
}

export interface MinistryDetailDTO {
    id: string;
    description: string
}
