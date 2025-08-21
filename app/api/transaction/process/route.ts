import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, promisifyDatabase } from '@/lib/database';
import { TransactionRequest, HSAAccount } from '@/lib/types';
import { isMedicalExpense } from '@/lib/medical-expenses';

export async function POST(request: NextRequest) {
  try {
    const body: TransactionRequest = await request.json();
    const { amount, merchant, category } = body;

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

    if (!merchant || !category) {
      return NextResponse.json(
        { error: 'Merchant and category are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const dbAsync = promisifyDatabase(db);

    try {
      // First, get the HSA account and active card for the user
      const account = await dbAsync.get<{ account_id: string; balance: number; card_id?: string }>(
        `SELECT ha.id as account_id, ha.balance, vc.id as card_id 
         FROM hsa_accounts ha 
         LEFT JOIN virtual_cards vc ON ha.id = vc.account_id AND vc.is_active = 1
         WHERE ha.user_id = ?`,
        [userId]
      );

      if (!account) {
        return NextResponse.json(
          { error: 'HSA account not found' },
          { status: 404 }
        );
      }

      if (!account.card_id) {
        return NextResponse.json(
          { error: 'No active virtual card found' },
          { status: 400 }
        );
      }

      if (account.balance < amount) {
        return NextResponse.json(
          { error: 'Insufficient funds' },
          { status: 400 }
        );
      }

      // Check if this is a medical expense
      const isMedical = isMedicalExpense(category);
      const transactionId = uuidv4();

      // Record the transaction first
      await dbAsync.run(
        'INSERT INTO transactions (id, account_id, card_id, amount, merchant, category, is_medical_expense, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [transactionId, account.account_id, account.card_id, amount, merchant, category, isMedical, 'expense']
      );

      // Only update balance if transaction is approved (medical expense)
      if (isMedical) {
        const newBalance = account.balance - amount;
        await dbAsync.run(
          'UPDATE hsa_accounts SET balance = ? WHERE id = ?',
          [newBalance, account.account_id]
        );

        return NextResponse.json({
          message: 'Transaction processed successfully',
          transaction: {
            id: transactionId,
            amount,
            merchant,
            category,
            is_medical_expense: isMedical,
            new_balance: newBalance,
            status: 'APPROVED'
          }
        });
      } else {
        // Transaction declined - don't update balance
        return NextResponse.json({
          message: 'Transaction processed successfully',
          transaction: {
            id: transactionId,
            amount,
            merchant,
            category,
            is_medical_expense: isMedical,
            new_balance: account.balance, // Keep original balance
            status: 'DECLINED - Non-medical expense'
          }
        });
      }
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