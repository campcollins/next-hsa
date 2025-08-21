import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, promisifyDatabase } from '@/lib/database';
import { HSAAccount } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount } = body;

    // Get user ID from query params (in a real app, this would come from authentication)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const dbAsync = promisifyDatabase(db);

    try {
      // First, get the HSA account for the user
      const account = await dbAsync.get<HSAAccount>(
        'SELECT id, balance FROM hsa_accounts WHERE user_id = ?',
        [userId]
      );

      if (!account) {
        return NextResponse.json(
          { error: 'HSA account not found' },
          { status: 404 }
        );
      }

      // Simulate bank connection verification
      const bankConnectionSteps = [
        'Checking for bank connection...',
        'Verifying account information...',
        'Validating routing number...',
        'Confirming account ownership...',
        'Processing deposit...'
      ];

      // Use the provided amount
      const depositAmount = amount;
      const depositId = uuidv4();
      const newBalance = account.balance + depositAmount;

      // Create deposit record
      await dbAsync.run(
        'INSERT INTO deposits (id, account_id, amount) VALUES (?, ?, ?)',
        [depositId, account.id, depositAmount]
      );

      // Create transaction record for the deposit
      const transactionId = uuidv4();
      await dbAsync.run(
        'INSERT INTO transactions (id, account_id, amount, merchant, category, is_medical_expense, transaction_date, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [transactionId, account.id, depositAmount, 'Direct Contribution', 'DEPOSIT', 0, new Date().toISOString(), 'deposit']
      );

      // Update account balance
      await dbAsync.run(
        'UPDATE hsa_accounts SET balance = ? WHERE id = ?',
        [newBalance, account.id]
      );

      return NextResponse.json({
        message: 'Deposit processed successfully',
        deposit: {
          id: depositId,
          amount: depositAmount,
          new_balance: newBalance,
          bank_verification_steps: bankConnectionSteps,
          status: 'COMPLETED'
        }
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    } finally {
      db.close();
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
} 