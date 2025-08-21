import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, promisifyDatabase } from '@/lib/database';
import { HSAAccount } from '@/lib/types';

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
      const account = await dbAsync.get<HSAAccount>(
        'SELECT id, balance, created_at FROM hsa_accounts WHERE user_id = ?',
        [userId]
      );

      if (!account) {
        return NextResponse.json(
          { error: 'HSA account not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ account });
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