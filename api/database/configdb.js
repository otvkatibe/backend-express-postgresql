import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log("Database URL:", process.env.DATABASE_URL); // Debug

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const connect = async () => {
  try {
    const client = await pool.connect(); // Use client para evitar vazamentos
    console.log("Connected to PostgreSQL successfully!");
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    client.release(); // Libere a conexão
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      connectionString: process.env.DATABASE_URL // Mostra a string usada
    });
    process.exit(1);
  }
}

export default { connect, pool };