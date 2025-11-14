import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

// Validation schema for updating inquiry
const updateInquirySchema = z.object({
  status: z.enum(['RESPONDED', 'ARCHIVED', 'UNREAD']).optional(),
  internalNotes: z.string().max(1000, 'Notes must not exceed 1000 characters').optional(),
});

/**
 * PATCH /api/inquiries/[id] - Update inquiry status and notes
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateInquirySchema.parse(body);

    // Verify inquiry exists and belongs to this ranch
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: params.id },
      select: { ranchId: true },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    if (inquiry.ranchId !== ranch.id) {
      return NextResponse.json(
        { error: 'Access denied. This inquiry belongs to another ranch.' },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;
      
      // Set respondedAt timestamp when marking as RESPONDED
      if (validatedData.status === 'RESPONDED') {
        updateData.respondedAt = new Date();
      }
      
      // Clear respondedAt when reopening (setting to UNREAD)
      if (validatedData.status === 'UNREAD') {
        updateData.respondedAt = null;
      }
    }

    if (validatedData.internalNotes !== undefined) {
      updateData.internalNotes = validatedData.internalNotes;
    }

    // Update inquiry
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: params.id },
      data: updateData,
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
    });

    return NextResponse.json({ inquiry: updatedInquiry });
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
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the inquiry' },
      { status: 500 }
    );
  }
}
