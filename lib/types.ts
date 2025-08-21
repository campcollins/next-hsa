export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface HSAAccount {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
}

export interface VirtualCard {
  id: string;
  account_id: string;
  card_number: string;
  cvv: string;
  expiry_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  card_id?: string;
  amount: number;
  merchant: string;
  category: string;
  is_medical_expense: boolean;
  transaction_date: string;
  type: 'expense' | 'deposit';
}

export interface Deposit {
  id: string;
  account_id: string;
  amount: number;
  deposit_date: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface DepositRequest {
  amount: number;
}

export interface TransactionRequest {
  amount: number;
  merchant: string;
  category: string;
}

export interface MedicalExpenseCategory {
  category: string;
  isQualified: boolean;
  description: string;
} 