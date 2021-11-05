import { parseJSON } from 'date-fns';

export type UUID = string;
export type Timestamp = number
export type InstitutionID = UUID;

export type Experiences = 'Junior' | 'Confirmé' | 'Senior';
export type Contract = 'CDI' | 'CDD' | 'Freelance';

export interface Job {
    uuid: UUID;
    title: string;
    institutionId: InstitutionID;
    team: string;
    availableContracts: Contract[]
    experiences: Experiences[]
    publicationDate: Timestamp
    limitDate: Timestamp | null

    // details may be another VO/interface or MD block
    details: string
    updatedAt?: number
    // mission: string;
    // team?: string
    // locations?: string[]
    // teamInfo?: string
    // mission?: string
    // tasks?: string[]
    // profile?: string[]
    // salary?: string
    // hiringProcess?: string
    // conditions?: string[]
    // advantages?: string
    // more?: string

    // useless
    // slug?: string
    // toApply?: string
}

interface NewJobProps {
    uuid?: UUID;
    title: string;
    institutionId: string;
    team: string;
    availableContracts: string[]
    experiences: string[]
    publicationDate: string
    limitDate: string | null
    details: string
    updatedAt?: number
}

export const createJob = (
    {
        uuid = 'abc',
        title,
        institutionId,
        team,
        availableContracts,
        experiences,
        publicationDate,
        limitDate,
        details,
        updatedAt,
    }: NewJobProps): Job | Error => {

    // fixme: Validation tres basique + cast pour validation à changer avec des VOs
    // Check dates are valids
    // Check at least on value for exp and contacts
    // ...
    if (!title || !institutionId || !team || !availableContracts || !experiences || !publicationDate) {
        return new Error('Missing fields');
    }

    // add domain methods here later
    return {
        uuid,
        title,
        institutionId,
        team,
        availableContracts: availableContracts as Contract[],
        experiences: experiences as Experiences[],
        publicationDate: parseJSON(publicationDate).getTime(),
        limitDate: limitDate ? parseJSON(limitDate).getTime() : null,
        details,
        updatedAt,
    };
};

export interface Institution {
    uuid: UUID;
    name: string;
    description: string;
}

interface NewInstitutionProps {
    uuid?: UUID;
    name: string;
    description: string;
}

export const createInstitution = (
    {
        uuid = 'abc',
        name,
        description,
    }: NewInstitutionProps): Institution | Error => {

    // fixme: Validation tres basique + cast pour validation à changer avec des VOs
    if (!name) {
        return new Error('Missing fields');
    }

    // add domain methods here later
    return {
        uuid,
        name,
        description,
    };
};

