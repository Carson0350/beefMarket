import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { bullId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if bull exists
    const bull = await prisma.bull.findUnique({
      where: { id: params.bullId },
    });

    if (!bull) {
      return NextResponse.json({ error: 'Bull not found' }, { status: 404 });
    }

    // Create favorite (unique constraint will prevent duplicates)
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        bullId: params.bullId,
      },
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error: any) {
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Already favorited' },
        { status: 400 }
      );
    }

    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { bullId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: session.user.id,
        bullId: params.bullId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
