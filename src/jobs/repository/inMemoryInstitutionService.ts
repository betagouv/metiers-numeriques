import { Institution } from '../entities';
import { InstitutionsRepository } from '../interfaces';
import { InstitutionDetailDTO } from '../types';

interface InMemory {
    state: Institution[];
    feedWith(institution: Institution[]): InstitutionsRepository;
}

export const InMemoryInstitutionsService: InstitutionsRepository & InMemory = {
    state: [],
    // Write Side
    async add(institution: InstitutionDetailDTO): Promise<void> {
        this.state.push(institution);
    },

    feedWith(institutions: Institution[]): InstitutionsRepository {
        for (const institution of institutions) {
            this.add(institution).then();
        }

        return this;
    },

    async count(): Promise<number> {
        return this.state.length;
    },

    // Read Side
    async list(): Promise<InstitutionDetailDTO[]> {
        return this.state.map(institutionToDTO);
    },

    async get(institutionId: string): Promise<InstitutionDetailDTO | null> {
        return institutionToDTO(this.state.find(i => i.uuid === institutionId)!);
    },
};

function institutionToDTO(institution: Institution): InstitutionDetailDTO {
    return {
        uuid: institution.uuid,
        name: institution.name,
        description: institution.description
    };
}
