import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { sendInquiryNotification } from '@/lib/email-inquiry';
import { auth } from '@/auth';

// Rate limiting store (in-memory for now, consider Redis for production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Validation schema
const createInquirySchema = z.object({
  bullId: z.string().cuid('Invalid bull ID format'),
  breederName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  breederEmail: z.string().email('Invalid email address'),
  breederPhone: z.string().optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
});

type CreateInquiryRequest = z.infer<typeof createInquirySchema>;

// Rate limiting helper
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    // Reset or create new record
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + 60 * 60 * 1000, // 1 hour from now
    });
    return true;
  }

  if (record.count >= 10) {
    return false; // Rate limit exceeded
  }

  record.count++;
  return true;
}

// Sanitize message to prevent XSS
function sanitizeMessage(message: string): string {
  return message
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * GET /api/inquiries - Fetch inquiries for authenticated ranch owner
 * Query params: status (optional), page (default: 1), limit (default: 20, max: 100)
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'UNREAD' | 'RESPONDED' | 'ARCHIVED' | null;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      ranchId: ranch.id,
    };

    if (status) {
      where.status = status;
    }

    // Fetch inquiries with pagination
    const [inquiries, totalCount] = await Promise.all([
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
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.inquiry.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      inquiries,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching inquiries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createInquirySchema.parse(body);

    // Verify bull exists and is published
    const bull = await prisma.bull.findUnique({
      where: { id: validatedData.bullId },
      select: {
        id: true,
        name: true,
        slug: true,
        heroImage: true,
        status: true,
        ranchId: true,
        ranch: {
          select: {
            name: true,
            contactEmail: true,
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

    if (bull.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'This bull is not available for inquiries' },
        { status: 404 }
      );
    }

    // Sanitize message content
    const sanitizedMessage = sanitizeMessage(validatedData.message);

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        bullId: validatedData.bullId,
        ranchId: bull.ranchId,
        breederName: validatedData.breederName,
        breederEmail: validatedData.breederEmail,
        breederPhone: validatedData.breederPhone || null,
        message: sanitizedMessage,
        status: 'UNREAD',
      },
      select: {
        id: true,
        bullId: true,
        ranchId: true,
        breederName: true,
        breederEmail: true,
        breederPhone: true,
        message: true,
        status: true,
        createdAt: true,
      },
    });

    // TODO: Email notification - requires RESEND_API_KEY configuration
    // Uncomment when Resend is configured in production
    /*
    sendInquiryNotification({
      ranchOwnerEmail: bull.ranch.contactEmail,
      ranchOwnerName: bull.ranch.name,
      ranchName: bull.ranch.name,
      bull: {
        name: bull.name,
        slug: bull.slug,
        heroImage: bull.heroImage,
      },
      inquiry: {
        breederName: inquiry.breederName,
        breederEmail: inquiry.breederEmail,
        breederPhone: inquiry.breederPhone,
        message: inquiry.message,
        createdAt: inquiry.createdAt,
      },
    }).catch((error) => {
      console.error('Failed to send inquiry notification email:', error);
    });
    */

    return NextResponse.json(
      { inquiry },
      { status: 201 }
    );
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your inquiry' },
      { status: 500 }
    );
  }
}
