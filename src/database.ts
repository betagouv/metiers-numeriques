import knex, {Knex} from 'knex';
import config from './knexfile';

export const database: Knex = knex(process.env.NODE_ENV ? config[process.env.NODE_ENV] : config['development']);
