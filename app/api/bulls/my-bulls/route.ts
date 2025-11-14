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
        { success: false, message: 'Ranch not found' },
        { status: 404 }
      );
    }

    // Get all bulls for this ranch
    const bulls = await prisma.bull.findMany({
      where: { ranchId: ranch.id },
      select: {
        id: true,
        slug: true,
        name: true,
        breed: true,
        heroImage: true,
        status: true,
        archived: true,
        availableStraws: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      bulls,
    });
  } catch (error) {
    console.error('Error fetching bulls:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
