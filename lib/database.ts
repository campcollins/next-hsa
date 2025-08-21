import sqlite3 from 'sqlite3';
import path from 'path';
import { User, HSAAccount, VirtualCard, Transaction, Deposit } from './types';

const dbPath = path.join(process.cwd(), 'hsa.db');

export function getDatabase() {
  return new sqlite3.Database(dbPath);
}

// Helper function to properly type database results
export function promisifyDatabase(db: sqlite3.Database): {
  get: <T = any>(sql: string, params?: any[]) => Promise<T>;
  all: <T = any>(sql: string, params?: any[]) => Promise<T[]>;
  run: (sql: string, params?: any[]) => Promise<{ lastID: number; changes: number }>;
} {
  return {
    get: (sql: string, params: any[] = []) => {
      return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row as any);
        });
      });
    },
    all: (sql: string, params: any[] = []) => {
      return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows as any);
        });
      });
    },
    run: (sql: string, params: any[] = []) => {
      return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        });
      });
    }
  };
}

export async function initializeDatabase() {
  return new Promise<void>((resolve, reject) => {
    const db = getDatabase();
    
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // HSA accounts table
      db.run(`
        CREATE TABLE IF NOT EXISTS hsa_accounts (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          balance DECIMAL(10,2) DEFAULT 0.00,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Virtual cards table
      db.run(`
        CREATE TABLE IF NOT EXISTS virtual_cards (
          id TEXT PRIMARY KEY,
          account_id TEXT NOT NULL,
          card_number TEXT UNIQUE NOT NULL,
          cvv TEXT NOT NULL,
          expiry_date TEXT NOT NULL,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (account_id) REFERENCES hsa_accounts (id)
        )
      `);

      // Transactions table
      db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          account_id TEXT NOT NULL,
          card_id TEXT,
          amount DECIMAL(10,2) NOT NULL,
          merchant TEXT NOT NULL,
          category TEXT NOT NULL,
          is_medical_expense BOOLEAN NOT NULL,
          transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          type TEXT DEFAULT 'expense',
          FOREIGN KEY (account_id) REFERENCES hsa_accounts (id),
          FOREIGN KEY (card_id) REFERENCES virtual_cards (id)
        )
      `);

      // Deposits table
      db.run(`
        CREATE TABLE IF NOT EXISTS deposits (
          id TEXT PRIMARY KEY,
          account_id TEXT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          deposit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (account_id) REFERENCES hsa_accounts (id)
        )
      `);

      // Migration: Add type column to transactions if it doesn't exist
      db.run(`
        ALTER TABLE transactions ADD COLUMN type TEXT DEFAULT 'expense'
      `, (err) => {
        // Ignore error if column already exists
        if (err && !err.message.includes('duplicate column name')) {
          console.warn('Migration warning:', err.message);
        }
      });
    });

    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
} 