export interface JobModel {
    id?: string;
    uuid: string;
    title: string;
    institution_id: string;
    team: string;
    available_contracts: string;
    experiences: string;
    publication_date: Date;
    limit_date: Date | null;
    created_at: Date;
    updated_at: Date | null;
}

export interface InstitutionModel {
    id?: string;
    uuid: string;
    name: string;
    description: string;
}
