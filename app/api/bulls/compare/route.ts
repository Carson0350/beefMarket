import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json(
        { error: 'Bull IDs are required' },
        { status: 400 }
      );
    }

    const ids = idsParam.split(',').filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'At least one bull ID is required' },
        { status: 400 }
      );
    }

    const bulls = await prisma.bull.findMany({
      where: {
        id: { in: ids },
        archived: false,
      },
      include: {
        ranch: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Maintain the order of requested IDs
    const orderedBulls = ids
      .map((id) => bulls.find((bull) => bull.id === id))
      .filter(Boolean);

    return NextResponse.json(orderedBulls);
  } catch (error) {
    console.error('Error fetching bulls for comparison:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bulls' },
      { status: 500 }
    );
  }
}
