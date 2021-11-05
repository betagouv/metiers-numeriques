interface IJobListDTO {
    uuid: string
    title: string
    institution: Pick<InstitutionDetailDTO, 'uuid' | 'name'>
    team: string
    availableContracts: string[]
    experiences: string[]
    publicationDate: number
    limitDate: number | null

    details: string

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

    details: string

    updatedAt: number | null
}

export interface InstitutionDetailDTO {
    uuid: string;
    name: string
    description: string
}
