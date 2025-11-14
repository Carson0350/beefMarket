import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// PATCH /api/favorites/[bullId]/notifications - Toggle notification setting
export async function PATCH(
  request: Request,
  { params }: { params: { bullId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { enabled } = await request.json();

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Update the favorite's notification setting
    const result = await prisma.favorite.updateMany({
      where: {
        userId: session.user.id,
        bullId: params.bullId,
      },
      data: {
        notificationsEnabled: enabled,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, enabled });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
