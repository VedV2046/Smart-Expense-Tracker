const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false // Required for most cloud hosted databases like Render/Neon
        }
      }
    : {
        user: process.env.PGUSER || 'postgres',
        host: process.env.PGHOST || 'localhost',
        database: process.env.PGDATABASE || 'expense_tracker',
        password: process.env.PGPASSWORD || 'postgres',
        port: process.env.PGPORT || 5432,
      }
);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
