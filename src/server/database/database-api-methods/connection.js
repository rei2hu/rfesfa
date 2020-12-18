const pg = require('pg');

if (!process.env.DATABASE_URL) throw new Error('missing environment variable DATABASE_URL');

const database = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
database.connect();

module.exports = database;
