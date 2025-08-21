import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, promisifyDatabase } from '@/lib/database';
import { VirtualCard } from '@/lib/types';

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
      // Get the active virtual card for the user
      const card = await dbAsync.get<VirtualCard>(
        `SELECT vc.id, vc.card_number, vc.cvv, vc.expiry_date, vc.is_active, vc.created_at
         FROM virtual_cards vc
         JOIN hsa_accounts ha ON vc.account_id = ha.id
         WHERE ha.user_id = ? AND vc.is_active = 1`,
        [userId]
      );

      return NextResponse.json({ card });
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