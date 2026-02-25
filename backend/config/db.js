const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'banket',
  password: 'Fkflby441188',
  port: 5432,
});

module.exports = pool;