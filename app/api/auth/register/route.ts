import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, promisifyDatabase } from '@/lib/database';
import { CreateUserRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json();
    const { email, password, first_name, last_name } = body;

    // Validate input
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const dbAsync = promisifyDatabase(db);
    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    try {
      await dbAsync.run(
        'INSERT INTO users (id, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
        [userId, email, passwordHash, first_name, last_name]
      );

      // Create HSA account for the user
      const accountId = uuidv4();
      await dbAsync.run(
        'INSERT INTO hsa_accounts (id, user_id, balance) VALUES (?, ?, ?)',
        [accountId, userId, 0.00]
      );

      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');
      
      return NextResponse.json(
        { 
          message: 'User created successfully',
          user: {
            id: userId,
            email,
            first_name,
            last_name
          },
          token: token
        },
        { status: 201 }
      );
    } catch (error: any) {
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }
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