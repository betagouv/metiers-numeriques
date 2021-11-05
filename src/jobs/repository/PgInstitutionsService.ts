import { Knex } from 'knex';
import { InstitutionModel } from '../../knex/models';
import { Institution } from '../entities';
import { InstitutionsService } from '../interfaces';
import { InstitutionDetailDTO, InstitutionListDTO } from '../types';

export const PgInstitutionsServiceFactory = (db: Knex): InstitutionsService => ({
    // Write Side
    async add(institution: Institution): Promise<void> {
        await db('institutions').insert(institutionToDatabase(institution));
    },

    async count(): Promise<number> {
        return db('institutions').count();
    },

    // Read Side
    async list(): Promise<InstitutionListDTO> {
        const results = await db
            .select('uuid', 'name', 'description')
            .from<InstitutionModel>('institutions');

        return results.map(r => ({
            uuid: r.uuid,
            name: r.name,
            description: r.description,
        }));
    },

    async get(institutionId: string): Promise<InstitutionDetailDTO | null> {
        const result = await db
            .select('uuid', 'name', 'description')
            .from<InstitutionModel>('institutions')
            .where('institution_id', institutionId)
            .first();

        if (!result) {
            return null;
        }

        return {
            uuid: result.uuid,
            name: result.name,
            description: result.description,
        };
    },
});

function institutionToDatabase(institution: Institution): InstitutionModel {
    return {
        uuid: institution.uuid,
        name: institution.name,
        description: institution.description,
    };
}
