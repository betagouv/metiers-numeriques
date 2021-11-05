import knex, {Knex} from 'knex';
import config from './knexfile';

export const database: Knex = knex(config);
