import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, promisifyDatabase } from '@/lib/database';
import { HSAAccount, VirtualCard } from '@/lib/types';

export async function POST(request: NextRequest) {
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
      // First, get the HSA account for the user
      const account = await dbAsync.get<HSAAccount>(
        'SELECT id FROM hsa_accounts WHERE user_id = ?',
        [userId]
      );

      if (!account) {
        return NextResponse.json(
          { error: 'HSA account not found' },
          { status: 404 }
        );
      }

      // Check if user already has an active card
      const existingCard = await dbAsync.get<VirtualCard>(
        'SELECT id FROM virtual_cards WHERE account_id = ? AND is_active = 1',
        [account.id]
      );

      if (existingCard) {
        return NextResponse.json(
          { error: 'User already has an active virtual card' },
          { status: 409 }
        );
      }

      // Generate virtual card details
      const cardId = uuidv4();
      const cardNumber = generateCardNumber();
      const cvv = generateCVV();
      const expiryDate = generateExpiryDate();

      await dbAsync.run(
        'INSERT INTO virtual_cards (id, account_id, card_number, cvv, expiry_date) VALUES (?, ?, ?, ?, ?)',
        [cardId, account.id, cardNumber, cvv, expiryDate]
      );

      return NextResponse.json({
        message: 'Virtual card issued successfully',
        card: {
          id: cardId,
          card_number: cardNumber,
          cvv: cvv,
          expiry_date: expiryDate
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

function generateCardNumber(): string {
  // Generate a 16-digit card number (simplified for demo)
  const digits = '0123456789';
  let cardNumber = '';
  for (let i = 0; i < 16; i++) {
    cardNumber += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return cardNumber;
}

function generateCVV(): string {
  // Generate a 3-digit CVV
  const digits = '0123456789';
  let cvv = '';
  for (let i = 0; i < 3; i++) {
    cvv += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return cvv;
}

function generateExpiryDate(): string {
  // Generate expiry date 3 years from now
  const now = new Date();
  const expiryYear = now.getFullYear() + 3;
  const expiryMonth = String(now.getMonth() + 1).padStart(2, '0');
  return `${expiryMonth}/${expiryYear}`;
} 