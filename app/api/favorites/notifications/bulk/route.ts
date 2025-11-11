import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// PATCH /api/favorites/notifications/bulk - Bulk update notification settings
export async function PATCH(request: Request) {
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

    // Update all user's favorites
    const result = await prisma.favorite.updateMany({
      where: {
        userId: session.user.id,
      },
      data: {
        notificationsEnabled: enabled,
      },
    });

    return NextResponse.json({ success: true, count: result.count, enabled });
  } catch (error) {
    console.error('Error bulk updating notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
