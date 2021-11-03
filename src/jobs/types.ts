export interface JobDetailDTO {
    id: string
    title: string
    institution: Pick<InstitutionDetailDTO, 'id' | 'name'>
    team: string
    availableContracts: string[]
    experiences: string[]
    publicationDate: number
    limitDate: number | null

    details: string

    updatedAt: number | null
}

export interface InstitutionDetailDTO {
    id: string;
    name: string
    description: string
}
