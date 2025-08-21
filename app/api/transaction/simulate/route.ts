import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, promisifyDatabase } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';
import sampleTransactions from '@/data/sampleTransactions.json';
import acceptedMCCs from '@/data/acceptedMCCs.json';

export async function POST(request: NextRequest) {
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
            // Get user's account and card information
            const account = await dbAsync.get<{ account_id: string; balance: number; card_id?: string }>(
                `SELECT ha.id as account_id, ha.balance, vc.id as card_id
                 FROM hsa_accounts ha
                 LEFT JOIN virtual_cards vc ON ha.id = vc.account_id AND vc.is_active = 1
                 WHERE ha.user_id = ?`,
                [userId]
            );

            if (!account) {
                return NextResponse.json(
                    { error: 'Account not found' },
                    { status: 404 }
                );
            }

            if (!account.card_id) {
                return NextResponse.json(
                    { error: 'No active virtual card found' },
                    { status: 400 }
                );
            }

            // Randomly select a transaction from sample data
            const randomTransaction = sampleTransactions[Math.floor(Math.random() * sampleTransactions.length)];
            
            // Check if MCC is in accepted list
            const isAccepted = acceptedMCCs.some(mcc => mcc.mcc === randomTransaction.mcc);
            
            // Check if user has sufficient funds for the transaction
            if (account.balance < randomTransaction.amount) {
                const transactionId = uuidv4();
                const now = new Date().toISOString();
                
                // Record the declined transaction due to insufficient funds
                await dbAsync.run(
                    'INSERT INTO transactions (id, account_id, card_id, amount, merchant, category, is_medical_expense, transaction_date, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        transactionId,
                        account.account_id,
                        account.card_id,
                        randomTransaction.amount,
                        randomTransaction.bank_memo,
                        randomTransaction.mcc,
                        0, // Not a medical expense (declined due to insufficient funds)
                        now,
                        'expense'
                    ]
                );

                return NextResponse.json({
                    message: 'Transaction processed successfully',
                    transaction: {
                        id: transactionId,
                        amount: randomTransaction.amount,
                        merchant: randomTransaction.bank_memo,
                        category: randomTransaction.mcc,
                        is_medical_expense: false,
                        new_balance: account.balance, // Keep original balance
                        status: 'DECLINED - Insufficient funds',
                        created_at: now
                    }
                });
            }
            
            const transactionId = uuidv4();
            const now = new Date().toISOString();
            
            // Record the transaction
            await dbAsync.run(
                'INSERT INTO transactions (id, account_id, card_id, amount, merchant, category, is_medical_expense, transaction_date, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    transactionId,
                    account.account_id,
                    account.card_id,
                    randomTransaction.amount,
                    randomTransaction.bank_memo,
                    randomTransaction.mcc,
                    isAccepted ? 1 : 0,
                    now,
                    'expense'
                ]
            );

            // Only update balance if transaction is approved
            if (isAccepted) {
                const newBalance = account.balance - randomTransaction.amount;
                await dbAsync.run(
                    'UPDATE hsa_accounts SET balance = ? WHERE id = ?',
                    [newBalance, account.account_id]
                );

                return NextResponse.json({
                    message: 'Transaction processed successfully',
                    transaction: {
                        id: transactionId,
                        amount: randomTransaction.amount,
                        merchant: randomTransaction.bank_memo,
                        category: randomTransaction.mcc,
                        is_medical_expense: isAccepted,
                        new_balance: newBalance,
                        status: 'APPROVED',
                        created_at: now
                    }
                });
            } else {
                // Transaction declined - don't update balance
                return NextResponse.json({
                    message: 'Transaction processed successfully',
                    transaction: {
                        id: transactionId,
                        amount: randomTransaction.amount,
                        merchant: randomTransaction.bank_memo,
                        category: randomTransaction.mcc,
                        is_medical_expense: isAccepted,
                        new_balance: account.balance, // Keep original balance
                        status: 'DECLINED - Non-qualified expense',
                        created_at: now
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
            { error: 'Invalid request' },
            { status: 400 }
        );
    }
} 