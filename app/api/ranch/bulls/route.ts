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

    // Get user's ranch
    const ranch = await prisma.ranch.findUnique({
      where: { userId: session.user.id },
    });

    if (!ranch) {
      return NextResponse.json(
        { success: false, message: 'Ranch profile not found' },
        { status: 404 }
      );
    }

    // Fetch all bulls for this ranch
    const bulls = await prisma.bull.findMany({
      where: { ranchId: ranch.id },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate statistics
    const stats = {
      total: bulls.length,
      published: bulls.filter(b => b.status === 'PUBLISHED' && !b.archived).length,
      draft: bulls.filter(b => b.status === 'DRAFT').length,
      archived: bulls.filter(b => b.archived).length,
    };

    return NextResponse.json({
      success: true,
      bulls,
      stats,
      ranch: {
        name: ranch.name,
        slug: ranch.slug,
      },
    });
  } catch (error) {
    console.error('Bulls fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
