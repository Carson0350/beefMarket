import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { sendInventoryChangeEmail, sendPriceChangeEmail } from '@/lib/email';

// GET /api/bulls/[id] - Get single bull by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bull = await prisma.bull.findUnique({
      where: { id: params.id },
      include: {
        ranch: {
          select: {
            id: true,
            name: true,
            slug: true,
            state: true,
            contactEmail: true,
            contactPhone: true,
          },
        },
      },
    });

    if (!bull) {
      return NextResponse.json({ error: 'Bull not found' }, { status: 404 });
    }

    return NextResponse.json(bull);
  } catch (error) {
    console.error('Error fetching bull:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bull' },
      { status: 500 }
    );
  }
}

// PATCH /api/bulls/[id] - Update bull (ranch owner only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the bull to check ownership
    const existingBull = await prisma.bull.findUnique({
      where: { id: params.id },
      include: {
        ranch: {
          select: {
            userId: true,
            name: true,
            contactEmail: true,
            contactPhone: true,
          },
        },
      },
    });

    if (!existingBull) {
      return NextResponse.json({ error: 'Bull not found' }, { status: 404 });
    }

    // Check if user owns this bull's ranch
    if (existingBull.ranch.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Store old values for change detection
    const oldInventory = existingBull.availableStraws;
    const oldPrice = existingBull.pricePerStraw;

    // Update the bull
    const updatedBull = await prisma.bull.update({
      where: { id: params.id },
      data: body,
      include: {
        ranch: {
          select: {
            id: true,
            name: true,
            slug: true,
            state: true,
            contactEmail: true,
            contactPhone: true,
          },
        },
      },
    });

    // Detect inventory change and send notifications
    if (
      body.availableStraws !== undefined &&
      oldInventory !== updatedBull.availableStraws
    ) {
      // Run notification in background (don't await to avoid blocking response)
      notifyInventoryChange(existingBull, updatedBull).catch((error) => {
        console.error('Error sending inventory change notifications:', error);
      });
    }

    // Detect price change and send notifications
    if (
      body.pricePerStraw !== undefined &&
      oldPrice !== updatedBull.pricePerStraw &&
      oldPrice !== null &&
      updatedBull.pricePerStraw !== null
    ) {
      // Run notification in background (don't await to avoid blocking response)
      notifyPriceChange(existingBull, updatedBull, oldPrice, updatedBull.pricePerStraw).catch((error) => {
        console.error('Error sending price change notifications:', error);
      });
    }

    return NextResponse.json(updatedBull);
  } catch (error) {
    console.error('Error updating bull:', error);
    return NextResponse.json(
      { error: 'Failed to update bull' },
      { status: 500 }
    );
  }
}

// Helper function to determine change type
function determineChangeType(
  oldCount: number,
  newCount: number
): 'became_available' | 'running_low' | 'sold_out' | 'restocked' | 'inventory_updated' {
  if (oldCount === 0 && newCount > 0) return 'became_available';
  if (oldCount > 0 && newCount === 0) return 'sold_out';
  if (newCount <= 5 && newCount > 0) return 'running_low';
  if (newCount - oldCount >= 10) return 'restocked';
  return 'inventory_updated';
}

// Helper function to notify users of inventory changes
async function notifyInventoryChange(
  oldBull: any,
  newBull: any
): Promise<void> {
  const changeType = determineChangeType(
    oldBull.availableStraws,
    newBull.availableStraws
  );

  // Find users who favorited this bull with notifications enabled
  const favorites = await prisma.favorite.findMany({
    where: {
      bullId: newBull.id,
      notificationsEnabled: true,
    },
    include: {
      user: {
        select: { email: true },
      },
    },
  });

  // Send email to each user
  for (const favorite of favorites) {
    try {
      await sendInventoryChangeEmail({
        userEmail: favorite.user.email,
        bull: newBull,
        oldInventory: oldBull.availableStraws,
        newInventory: newBull.availableStraws,
        changeType,
      });
    } catch (error) {
      console.error(
        `Failed to send inventory change email to ${favorite.user.email}:`,
        error
      );
      // Continue sending to other users even if one fails
    }
  }
}

// Helper function to notify users of price changes
async function notifyPriceChange(
  oldBull: any,
  newBull: any,
  oldPrice: number,
  newPrice: number
): Promise<void> {
  const priceDifference = newPrice - oldPrice;
  const percentageChange = ((priceDifference / oldPrice) * 100).toFixed(1);
  const isDecrease = priceDifference < 0;

  // Find users who favorited this bull with notifications enabled
  const favorites = await prisma.favorite.findMany({
    where: {
      bullId: newBull.id,
      notificationsEnabled: true,
    },
    include: {
      user: {
        select: { email: true },
      },
    },
  });

  // Send email to each user
  for (const favorite of favorites) {
    try {
      await sendPriceChangeEmail({
        userEmail: favorite.user.email,
        bull: newBull,
        oldPrice,
        newPrice,
        priceDifference,
        percentageChange: parseFloat(percentageChange),
        isDecrease,
      });
    } catch (error) {
      console.error(
        `Failed to send price change email to ${favorite.user.email}:`,
        error
      );
      // Continue sending to other users even if one fails
    }
  }
}
