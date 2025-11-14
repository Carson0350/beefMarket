import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

// Validation schema for inquiry updates
const updateInquirySchema = z.object({
  status: z.enum(['UNREAD', 'RESPONDED', 'ARCHIVED']).optional(),
  internalNotes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get the inquiry and verify ownership
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: params.id },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // Verify the inquiry belongs to the ranch owner's ranch
    if (inquiry.ranchId !== ranch.id) {
      return NextResponse.json(
        { error: 'Unauthorized - This inquiry does not belong to your ranch' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const data = updateInquirySchema.parse(body);

    // Build update data
    const updateData: any = {};
    
    if (data.status !== undefined) {
      updateData.status = data.status;
      
      // Set respondedAt timestamp when marking as RESPONDED
      if (data.status === 'RESPONDED' && inquiry.status !== 'RESPONDED') {
        updateData.respondedAt = new Date();
      }
    }
    
    if (data.internalNotes !== undefined) {
      updateData.internalNotes = data.internalNotes;
    }

    updateData.updatedAt = new Date();

    // Update the inquiry
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

    return NextResponse.json({
      inquiry: updatedInquiry,
    });
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
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
