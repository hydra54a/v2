const knex = require('knex');
const config = require('../config');

// Initialize the Knex instance with MySQL connection details
const db = knex({
  client: 'mysql2',
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: config.db.port,
  },
});

module.exports = db;
