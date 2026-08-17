import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { LoginDTO, JWTPayload, UserSummary } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'iris_crm_jwt_super_secret_key_2026';
const JWT_EXPIRES_IN = '24h';

export class AuthService {
  /**
   * Authenticates administrator credentials and issues a secure JWT token.
   */
  async login(credentials: LoginDTO): Promise<{ token: string; user: UserSummary }> {
    const { email, password } = credentials;

    if (!email || !email.trim()) {
      throw new Error('Email address is required.');
    }

    if (!password || !password.trim()) {
      throw new Error('Password is required.');
    }

    const query = `
      SELECT id, name, email, password_hash, role
      FROM users
      WHERE email = $1
      LIMIT 1
    `;
    const result = await pool.query(query, [email.toLowerCase().trim()]);

    if (result.rowCount === 0) {
      throw new Error('Invalid email or password credentials.');
    }

    const userRow = result.rows[0];

    // Verify hashed password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, userRow.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password credentials.');
    }

    const payload: JWTPayload = {
      userId: userRow.id,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      token,
      user: {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        role: userRow.role,
      },
    };
  }

  /**
   * Verifies user by ID.
   */
  async getUserById(id: number): Promise<UserSummary | null> {
    const query = `SELECT id, name, email, role FROM users WHERE id = $1 LIMIT 1`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
    };
  }
}
