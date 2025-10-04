import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try to count users
    const userCount = await prisma.user.count();
    
    // Try to count accounts
    const accountCount = await prisma.account.count();
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      status: 'success',
      database: 'connected',
      userCount,
      accountCount,
      message: 'Database is working correctly',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
