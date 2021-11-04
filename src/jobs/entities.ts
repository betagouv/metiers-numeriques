import { parseJSON } from 'date-fns';

export type UUID = string;
export type Timestamp = number
export type InstitutionID = UUID;

export type Experiences = 'Junior' | 'Confirmé' | 'Senior';
export type Contract = 'CDI' | 'CDD' | 'Freelance';

export interface Job {
    id: UUID;
    title: string;
    institution: InstitutionID;
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
    id?: UUID;
    title: string;
    institution: string;
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
        id = 'abc',
        title,
        institution,
        team,
        availableContracts,
        experiences,
        publicationDate,
        limitDate,
        details,
        updatedAt,
    }: NewJobProps): Job | Error => {

    // fixme: Validation tres basique + cast pour validation à changer avec des VOs
    if (!title || !institution || !team || !availableContracts || !experiences || !publicationDate) {
        return new Error('Missing fields');
    }

    // add domain methods here later
    return {
        id,
        title,
        institution,
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
    id: UUID;
    name: string;
    description: string;
}

interface NewInstitutionProps {
    id?: UUID;
    name: string;
    description: string;
}

export const createInstitution = (
    {
        id = 'abc',
        name,
        description,
    }: NewInstitutionProps): Institution | Error => {

    // fixme: Validation tres basique + cast pour validation à changer avec des VOs
    if (!name) {
        return new Error('Missing fields');
    }

    // add domain methods here later
    return {
        id,
        name,
        description,
    };
};

