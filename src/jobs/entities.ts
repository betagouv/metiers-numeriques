import { parseJSON } from 'date-fns';

export type UUID = string;
export type Timestamp = number
export type Institution = UUID;

export type Experiences = 'Junior' | 'Confirmé' | 'Senior';
export type Contract = 'CDI' | 'CDD' | 'Freelance';

export interface Job {
    id: UUID;
    title: string;
    institution: Institution;
    team: string;
    availableContracts: Contract[]
    experiences: Experiences[]
    publicationDate: Timestamp
    limitDate: Timestamp | null

    // details may be another VO/interface or MD block
    details: string
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
    id: UUID;
    title: string;
    institution: string;
    team: string;
    availableContracts: string[]
    experiences: string[]
    publicationDate: string
    limitDate: string | null
    details: string
}

export const createJob = (
    {
        id,
        title,
        institution,
        team,
        availableContracts,
        experiences,
        publicationDate,
        limitDate,
        details,
    }: NewJobProps): Job | Error => {

    // fixme: Validation tres basique + cast pour validation à changer
    if (!id || !title || !institution || !team || !availableContracts || !experiences || !publicationDate) {
        return Error('Missing fields');
    }

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
    };
};
