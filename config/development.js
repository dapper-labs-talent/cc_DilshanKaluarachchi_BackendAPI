module.exports = {
    database: {
        user: 'postgres',
        host: 'localhost',
        database: 'DapperLabs',
        password: '123',
        port: 5432,
    },
    jwt: {
        key: 'DapperLabsJWTSecret',
        validDuration: '2h',
    }
};