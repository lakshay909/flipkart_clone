const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon.tech cloud-hosted PostgreSQL
  },
});

// Verify the connection on startup
pool.connect()
  .then((client) => {
    console.log('✅ Connected to PostgreSQL (Neon.tech)');
    client.release();
  })
  .catch((err) => {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
  });

module.exports = pool;
