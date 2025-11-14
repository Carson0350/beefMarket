import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

/**
 * GET /api/inquiries/analytics - Get inquiry analytics for ranch owner
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is a ranch owner
    if (session.user.role !== 'RANCH_OWNER') {
      return NextResponse.json(
        { error: 'Access denied. Ranch owner role required.' },
        { status: 403 }
      );
    }

    // Get ranch for this user
    const ranch = await prisma.ranch.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!ranch) {
      return NextResponse.json(
        { error: 'Ranch not found for this user' },
        { status: 404 }
      );
    }

    // Calculate metrics in parallel for performance
    const [
      totalCount,
      unreadCount,
      respondedCount,
      topBulls,
      monthlyData,
    ] = await Promise.all([
      // Total inquiries
      prisma.inquiry.count({
        where: { ranchId: ranch.id },
      }),

      // Unread count
      prisma.inquiry.count({
        where: { ranchId: ranch.id, status: 'UNREAD' },
      }),

      // Responded count (for response rate)
      prisma.inquiry.count({
        where: { ranchId: ranch.id, status: 'RESPONDED' },
      }),

      // Top 5 bulls by inquiry count
      prisma.inquiry.groupBy({
        by: ['bullId'],
        where: { ranchId: ranch.id },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),

      // Monthly inquiry counts for last 6 months
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*)::int as count
        FROM "Inquiry"
        WHERE "ranchId" = ${ranch.id}
          AND "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `,
    ]);

    // Calculate response rate
    const responseRate = totalCount > 0 
      ? Math.round((respondedCount / totalCount) * 100) 
      : 0;

    // Fetch bull details for top bulls
    const bullIds = topBulls.map((item) => item.bullId);
    const bulls = await prisma.bull.findMany({
      where: { id: { in: bullIds } },
      select: {
        id: true,
        name: true,
        slug: true,
        heroImage: true,
      },
    });

    // Combine bull data with counts
    const topBullsWithDetails = topBulls.map((item) => {
      const bull = bulls.find((b) => b.id === item.bullId);
      return {
        bullId: item.bullId,
        bullName: bull?.name || 'Unknown',
        bullSlug: bull?.slug || '',
        bullImage: bull?.heroImage || null,
        inquiryCount: item._count.id,
      };
    });

    // Format monthly data
    const monthlyInquiries = (monthlyData as any[]).map((item) => ({
      month: new Date(item.month).toISOString(),
      count: item.count,
    }));

    return NextResponse.json({
      metrics: {
        totalInquiries: totalCount,
        unreadCount,
        responseRate,
      },
      topBulls: topBullsWithDetails,
      monthlyInquiries,
    });
  } catch (error) {
    console.error('Error fetching inquiry analytics:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching analytics' },
      { status: 500 }
    );
  }
}
