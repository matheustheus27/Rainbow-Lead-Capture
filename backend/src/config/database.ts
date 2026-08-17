import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger';

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://dev_user:dev_password@localhost:5432/iris_crm';

export const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  logger.error('DatabasePool', 'Unexpected error on idle PostgreSQL client', {}, err);
});

/**
 * Seeds a default administrator into the database if not already present.
 */
const seedDefaultAdmin = async (): Promise<void> => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@iriscrm.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const adminName = process.env.ADMIN_NAME || 'System Administrator';

  try {
    const checkQuery = `SELECT id FROM users WHERE email = $1 LIMIT 1`;
    const checkRes = await pool.query(checkQuery, [adminEmail.toLowerCase().trim()]);

    if (!checkRes.rowCount || checkRes.rowCount === 0) {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

      const insertQuery = `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
      `;
      await pool.query(insertQuery, [adminName, adminEmail.toLowerCase().trim(), passwordHash, 'admin']);
      logger.info('DatabaseSeed', 'Default administrator account seeded successfully', { email: adminEmail });
    } else {
      logger.info('DatabaseSeed', 'Default administrator account verified', { email: adminEmail });
    }
  } catch (error) {
    logger.error('DatabaseSeed', 'Failed to seed default administrator', { email: adminEmail }, error);
  }
};

/**
 * Initializes the database schema if tables do not exist.
 * Includes retries to ensure graceful connection during Docker startup.
 */
export const initializeDatabase = async (retries = 5, delay = 3000): Promise<void> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.info('Database', 'Connecting to PostgreSQL database', { attempt, maxRetries: retries });
      
      const createTablesQuery = `
        -- Customers Table
        CREATE TABLE IF NOT EXISTS customers (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          cpf VARCHAR(14) NOT NULL,
          email VARCHAR(255) NOT NULL,
          favorite_rainbow_color VARCHAR(50) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_cpf ON customers (cpf);
        CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers (created_at);

        -- Users / Admin Accounts Table
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'admin',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);
      `;

      await pool.query(createTablesQuery);
      logger.info('Database', 'Database tables and unique indexes verified successfully');

      // Automatically seed default administrator
      await seedDefaultAdmin();

      return;
    } catch (error) {
      logger.warn('Database', `Connection attempt ${attempt} failed`, { attempt, maxRetries: retries, error: (error as Error).message });
      if (attempt === retries) {
        logger.error('Database', `Failed to initialize database after ${retries} attempts`, {}, error);
        throw new Error(`Failed to initialize database after ${retries} attempts: ${(error as Error).message}`);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

export default pool;
