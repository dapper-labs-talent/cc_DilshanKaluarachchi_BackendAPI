const path = require('path');

module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            user: 'postgres',
            password: '123',
            database: 'DapperLabs',
            charset: 'utf8'
        },
        migrations: {
            directory: __dirname + '/knex/migrations',
        },
        seeds: {
            directory: __dirname + '/knex/seeds'
        }
    }
};