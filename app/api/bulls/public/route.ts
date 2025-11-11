import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const skip = (page - 1) * limit;

    // Fetch published, non-archived bulls with ranch data
    const [bulls, totalCount] = await Promise.all([
      prisma.bull.findMany({
        where: {
          status: 'PUBLISHED',
          archived: false,
        },
        include: {
          ranch: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.bull.count({
        where: {
          status: 'PUBLISHED',
          archived: false,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      bulls,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching bulls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bulls' },
      { status: 500 }
    );
  }
}
