import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, promisifyDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params (in a real app, this would come from authentication)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const dbAsync = promisifyDatabase(db);

    try {
      // Get account balance
      const account = await dbAsync.get<{ balance: number }>(
        'SELECT balance FROM hsa_accounts WHERE user_id = ?',
        [userId]
      );

      if (!account) {
        return NextResponse.json(
          { error: 'HSA account not found' },
          { status: 404 }
        );
      }

      // Get total deposits
      const depositsResult = await dbAsync.get<{ total_deposits: number }>(
        `SELECT COALESCE(SUM(amount), 0) as total_deposits 
         FROM deposits d
         JOIN hsa_accounts ha ON d.account_id = ha.id
         WHERE ha.user_id = ?`,
        [userId]
      );

      // Get total expenses (approved medical transactions)
      const expensesResult = await dbAsync.get<{ total_expenses: number }>(
        `SELECT COALESCE(SUM(amount), 0) as total_expenses 
         FROM transactions t
         JOIN hsa_accounts ha ON t.account_id = ha.id
         WHERE ha.user_id = ? AND t.is_medical_expense = 1`,
        [userId]
      );

      return NextResponse.json({
        summary: {
          current_balance: account.balance,
          total_deposits: depositsResult?.total_deposits || 0,
          total_expenses: expensesResult?.total_expenses || 0
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
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
} 