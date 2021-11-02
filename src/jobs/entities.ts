type UUID = string;
type Timestamp = number
type Institution = UUID;

type Experiences = 'Junior' | 'Confirmé' | 'Senior';
type Contract = 'CDI' | 'CDD' | 'Freelance';

interface JobProps {
    title: string;
    institution: Institution;
    team: string;
    availableContracts: Contract[]
    experiences: Experiences[]
    publicationDate: Timestamp
    limitDate: Timestamp | null

    // details may be another VO/interface
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

class Job {
    constructor(private props: JobProps, private id?: UUID) {
    }
}
