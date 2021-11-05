import { Knex } from 'knex';

const config: Record<string, Knex.Config> = {
    'development': {
        client: 'pg',
        connection: {
            connectionString: 'postgresql://metiersnum:metiersnum@localhost:5432/metiersnum',
        },
        migrations: {
            extension: 'ts',
            directory: 'src/knex/migrations',
            tableName: 'migrations_history',
        },
        seeds: {
            extension: 'ts',
            directory: 'src/knex/seeds',
        },
    },
    'test': {
        client: 'pg',
        connection: {
            connectionString: 'postgresql://metiersnum:metiersnum@localhost:5433/metiersnumtest',
        },
        migrations: {
            extension: 'ts',
            directory: 'src/knex/migrations',
            tableName: 'migrations_history',
        },
        debug: true,
        seeds: {
            extension: 'ts',
            directory: 'src/knex/seeds',
        },
    },
    'production': {
        client: 'pg',
        connection: {
            connectionString: 'postgresql://metiersnum:metiersnum@localhost:5432/metiersnum'
        },
        migrations: {
            extension: 'ts',
            directory: 'src/knex/migrations',
            tableName: 'migrations_history',
        },
        seeds: {
            extension: 'ts',
            directory: 'src/knex/seeds',
        },
    },

};

export default config;
