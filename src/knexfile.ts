import { Knex } from 'knex';

const config: Knex.Config = {
    client: 'pg',
    connection: {
        connectionString: 'postgresql://metiersnum:metiersnum@localhost:5432/metiersnum'
    },
    migrations: {
        extension: 'ts',
        directory: 'knex/migrations',
        tableName: 'migrations_history',
    },
    seeds: {
        extension: 'ts',
        directory: 'knex/seeds',
    },
};

export default config;
