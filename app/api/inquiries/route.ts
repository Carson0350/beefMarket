import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { sendInquiryNotification } from '@/lib/email';
import { auth } from '@/auth';

// Validation schema matching client-side validation
const inquirySchema = z.object({
  bullId: z.string().cuid('Invalid bull ID'),
  breederName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  breederEmail: z.string().email('Please enter a valid email address'),
  breederPhone: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(
          val
        ),
      {
        message: 'Please enter a valid phone number',
      }
    ),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const data = inquirySchema.parse(body);

    // Verify bull exists and is published
    const bull = await prisma.bull.findUnique({
      where: { id: data.bullId },
      include: {
        ranch: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!bull) {
      return NextResponse.json(
        { error: 'Bull not found' },
        { status: 404 }
      );
    }

    if (bull.status !== 'PUBLISHED' || bull.archived) {
      return NextResponse.json(
        { error: 'Bull is not available for inquiries' },
        { status: 404 }
      );
    }

    // Create inquiry record
    const inquiry = await prisma.inquiry.create({
      data: {
        bullId: data.bullId,
        ranchId: bull.ranchId,
        breederName: data.breederName,
        breederEmail: data.breederEmail,
        breederPhone: data.breederPhone,
        message: data.message,
        status: 'UNREAD',
      },
    });

    // Send email notification asynchronously (non-blocking)
    // Don't await - let it run in background
    sendInquiryNotification({
      inquiry,
      bull: {
        name: bull.name,
        heroImage: bull.heroImage,
      },
      ranchOwnerEmail: bull.ranch.user.email!,
      ranchOwnerName: bull.ranch.name,
      ranchName: bull.ranch.name,
    }).catch((error) => {
      // Log error but don't fail the request
      console.error('Failed to send inquiry notification email:', error);
    });

    // Return success immediately (AC-5.2.1: async email delivery)
    return NextResponse.json(
      {
        inquiry: {
          id: inquiry.id,
          bullId: inquiry.bullId,
          ranchId: inquiry.ranchId,
          breederName: inquiry.breederName,
          breederEmail: inquiry.breederEmail,
          breederPhone: inquiry.breederPhone,
          message: inquiry.message,
          status: inquiry.status,
          createdAt: inquiry.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user || session.user.role !== 'RANCH_OWNER') {
      return NextResponse.json(
        { error: 'Unauthorized - Ranch owner access required' },
        { status: 401 }
      );
    }

    // Get ranch for authenticated user
    const ranch = await prisma.ranch.findUnique({
      where: { userId: session.user.id },
    });

    if (!ranch) {
      return NextResponse.json(
        { error: 'Ranch not found for your account' },
        { status: 404 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause (ranch-specific filtering)
    const where: any = { ranchId: ranch.id };
    if (status) {
      where.status = status.toUpperCase();
    }

    // Fetch inquiries with pagination
    const [inquiries, totalCount, unreadCount] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: {
          bull: {
            select: {
              id: true,
              name: true,
              slug: true,
              heroImage: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inquiry.count({ where }),
      prisma.inquiry.count({
        where: {
          ranchId: ranch.id,
          status: 'UNREAD',
        },
      }),
    ]);

    // Group inquiries by status for easier frontend rendering
    const groupedInquiries = {
      UNREAD: inquiries.filter((i) => i.status === 'UNREAD'),
      RESPONDED: inquiries.filter((i) => i.status === 'RESPONDED'),
      ARCHIVED: inquiries.filter((i) => i.status === 'ARCHIVED'),
    };

    return NextResponse.json({
      inquiries,
      groupedInquiries,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
