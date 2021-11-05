import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema
        .createTable('jobs', (table) => {
            table.increments('id').primary();
            table.uuid('uuid').index();
            table.uuid('institution_id').notNullable();
            table.text('title');
            table.text('team');
            table.json('available_contracts').notNullable();
            table.json('experiences').notNullable();
            table.datetime('publication_date').notNullable();
            table.datetime('limit_date');

            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at');
        });

    await knex.schema
        .createTable('institutions', (table) => {
            table.increments('id').primary();
            table.uuid('uuid').index();
            table.text('name');
            table.text('description');

            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('expires_at');
        });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropSchemaIfExists('jobs')
    await knex.schema.dropSchemaIfExists('institutions')
}

