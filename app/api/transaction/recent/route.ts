import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, promisifyDatabase } from '@/lib/database';
import { Transaction } from '@/lib/types';

export async function GET(request: NextRequest) {
    try {
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
            const transactions = await dbAsync.all<Transaction>(
                `SELECT t.id, t.amount, t.merchant, t.category, t.is_medical_expense, t.transaction_date, t.type
                 FROM transactions t
                 JOIN hsa_accounts ha ON t.account_id = ha.id
                 WHERE ha.user_id = ?
                 ORDER BY t.transaction_date DESC
                 LIMIT 5`,
                [userId]
            );

            return NextResponse.json({
                transactions: transactions || []
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