import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/medical-expenses';

export async function GET() {
  try {
    const categories = getAllCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 