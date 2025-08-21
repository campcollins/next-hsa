import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase, promisifyDatabase } from '@/lib/database';
import { LoginRequest, User } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const dbAsync = promisifyDatabase(db);

    try {
      const row = await dbAsync.get<User & { password_hash: string }>(
        'SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = ?',
        [email]
      );

      if (!row) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const isValidPassword = await bcrypt.compare(password, row.password_hash);
      
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(`${row.id}:${Date.now()}`).toString('base64');
      
      return NextResponse.json({
        message: 'Login successful',
        user: {
          id: row.id,
          email: row.email,
          first_name: row.first_name,
          last_name: row.last_name
        },
        token: token
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