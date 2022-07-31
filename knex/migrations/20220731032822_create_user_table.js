/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = 'user';

exports.up = async (knex) => {
    return knex.schema
        .createTable(tableName, (table) => {
            table.increments('id').primary().notNullable()
            table.string('email').primary().notNullable()
            table.string('password').notNullable()
            table.string('firstName').notNullable()
            table.string('lastName').notNullable()
            table.string('uuid').notNullable()
        })
        .then(() =>
            console.log(`Successfully created  the ${tableName} table.`)
        )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    return knex.schema.dropTable(tableName);
};
