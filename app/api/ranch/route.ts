import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const ranch = await prisma.ranch.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      success: true,
      ranch,
    });
  } catch (error) {
    console.error('Ranch fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
