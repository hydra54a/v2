require('dotenv').config({ path: './.env' });

// Log the database configuration to verify environment variables are loaded
console.log({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    JWT_SECRET: process.env.JWT_SECRET
});

const config = {
    port: process.env.PORT || 5001,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        connectTimeout: 60000,
    },
    listPerPage: 10,
    jwtSecret: process.env.JWT_SECRET, 
};

module.exports = config;
