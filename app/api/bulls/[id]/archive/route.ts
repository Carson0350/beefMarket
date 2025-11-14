import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Verify bull belongs to this ranch
    const bull = await prisma.bull.findUnique({
      where: { id: params.id },
    });

    if (!bull || bull.ranchId !== ranch.id) {
      return NextResponse.json(
        { success: false, message: 'Bull not found' },
        { status: 404 }
      );
    }

    // Archive the bull
    await prisma.bull.update({
      where: { id: params.id },
      data: { 
        archived: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Bull archived successfully',
    });
  } catch (error) {
    console.error('Error archiving bull:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
