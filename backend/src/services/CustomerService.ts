import pool from '../config/database';
import { Customer, CustomerInput } from '../models/Customer';
import { validateCPFDetailed, formatCPF, cleanCPF } from '../utils/cpfValidator';

export interface ColorDistribution {
  color: string;
  count: number;
  percentage: number;
}

export interface AnalyticsSummary {
  totalLeads: number;
  topColor: string | null;
  latestRegistration: Date | null;
  distribution: ColorDistribution[];
}

export class CustomerService {
  /**
   * Registers a new customer into the database following business constraints.
   */
  async registerCustomer(customer: CustomerInput): Promise<Customer> {
    // 1. Validation: Required fields
    if (!customer.fullName || customer.fullName.trim().length < 3) {
      throw new Error('Please provide a valid full name (at least 3 characters).');
    }

    if (!customer.cpf || !customer.cpf.trim()) {
      throw new Error('CPF number is required.');
    }

    // Mathematical CPF Checksum Verification
    const cpfValidation = validateCPFDetailed(customer.cpf);
    if (!cpfValidation.isValid) {
      throw new Error(cpfValidation.errorMessage || 'Invalid CPF number.');
    }

    if (!customer.email || !customer.email.trim()) {
      throw new Error('Email address is required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email.trim())) {
      throw new Error('Please provide a valid email address.');
    }

    if (!customer.favoriteRainbowColor || !customer.favoriteRainbowColor.trim()) {
      throw new Error('Please select your favorite rainbow color.');
    }

    const formattedCpf = formatCPF(customer.cpf);
    const cleanedCpf = cleanCPF(customer.cpf);
    const trimmedEmail = customer.email.trim().toLowerCase();
    const trimmedName = customer.fullName.trim();
    const trimmedColor = customer.favoriteRainbowColor.trim();
    const trimmedNotes = customer.notes?.trim() || null;

    // 2. Single registration constraint check (SOLID / Business Rule)
    const checkQuery = `
      SELECT id FROM customers 
      WHERE cpf = $1 OR cpf = $2 
      LIMIT 1
    `;
    const checkResult = await pool.query(checkQuery, [formattedCpf, cleanedCpf]);

    if (checkResult.rowCount && checkResult.rowCount > 0) {
      throw new Error('A customer with this CPF number has already completed registration.');
    }

    // 3. Persistence layer insertion
    const insertQuery = `
      INSERT INTO customers (full_name, cpf, email, favorite_rainbow_color, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, full_name, cpf, email, favorite_rainbow_color, notes, created_at
    `;
    const values = [
      trimmedName,
      formattedCpf,
      trimmedEmail,
      trimmedColor,
      trimmedNotes,
    ];

    const result = await pool.query(insertQuery, values);
    const row = result.rows[0];

    return {
      id: row.id,
      fullName: row.full_name,
      cpf: row.cpf,
      email: row.email,
      favoriteRainbowColor: row.favorite_rainbow_color,
      notes: row.notes,
      createdAt: row.created_at,
    };
  }

  /**
   * Retrieves all customers ordered by creation date.
   */
  async listCustomers(): Promise<Customer[]> {
    const query = `
      SELECT id, full_name, cpf, email, favorite_rainbow_color, notes, created_at
      FROM customers
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      cpf: row.cpf,
      email: row.email,
      favoriteRainbowColor: row.favorite_rainbow_color,
      notes: row.notes,
      createdAt: row.created_at,
    }));
  }

  /**
   * Calculates real-time analytics and distribution of rainbow color preferences.
   */
  async getAnalytics(): Promise<AnalyticsSummary> {
    const totalQuery = `SELECT COUNT(*) as count, MAX(created_at) as latest_created_at FROM customers`;
    const distributionQuery = `
      SELECT favorite_rainbow_color as color, COUNT(*) as count 
      FROM customers 
      GROUP BY favorite_rainbow_color 
      ORDER BY count DESC
    `;

    const [totalRes, distRes] = await Promise.all([
      pool.query(totalQuery),
      pool.query(distributionQuery),
    ]);

    const totalLeads = parseInt(totalRes.rows[0]?.count || '0', 10);
    const latestRegistration = totalRes.rows[0]?.latest_created_at || null;

    const distribution: ColorDistribution[] = distRes.rows.map((row) => {
      const count = parseInt(row.count, 10);
      const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
      return {
        color: row.color,
        count,
        percentage,
      };
    });

    const topColor = distribution.length > 0 ? distribution[0].color : null;

    return {
      totalLeads,
      topColor,
      latestRegistration,
      distribution,
    };
  }
}
