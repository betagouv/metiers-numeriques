interface IJobListDTO {
    uuid: string
    title: string
    institution: Pick<InstitutionDetailDTO, 'uuid' | 'name'>
    team: string
    availableContracts: string[]
    experiences: string[]
    publicationDate: number
    limitDate: number | null

    details: JobElementsDTO

    updatedAt: number | null
}
export type JobListDTO = IJobListDTO[];
export interface JobDetailDTO {
    uuid: string
    title: string
    institution: Pick<InstitutionDetailDTO, 'uuid' | 'name'>
    team: string
    availableContracts: string[]
    experiences: string[]
    publicationDate: number
    limitDate: number | null

    details: JobElementsDTO

    updatedAt: number | null
}

export interface JobElementsDTO {
    mission: string;
    team: string
    locations: string
    teamInfo: string
    tasks: string
    profile: string
    salary: string
    hiringProcess: string
    conditions: string
    advantages: string
    more: string
    toApply: string
} {

}

export type InstitutionListDTO = InstitutionDetailDTO[];
export interface InstitutionDetailDTO {
    uuid: string;
    name: string
    description: string
}
