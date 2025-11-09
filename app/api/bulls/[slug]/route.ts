import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const bull = await prisma.bull.findUnique({
      where: { slug: params.slug },
      include: {
        ranch: {
          select: {
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
      return NextResponse.json(
        { success: false, message: 'Bull not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      bull,
    });
  } catch (error) {
    console.error('Bull fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's ranch
    const ranch = await prisma.ranch.findUnique({
      where: { userId: session.user.id },
    });

    if (!ranch) {
      return NextResponse.json(
        { success: false, message: 'Ranch profile required' },
        { status: 400 }
      );
    }

    // Get bull and verify ownership
    const bull = await prisma.bull.findUnique({
      where: { slug: params.slug },
    });

    if (!bull) {
      return NextResponse.json(
        { success: false, message: 'Bull not found' },
        { status: 404 }
      );
    }

    if (bull.ranchId !== ranch.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - not your bull' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Update bull with provided fields
    const updatedBull = await prisma.bull.update({
      where: { id: bull.id },
      data: {
        // Allow updating any fields provided
        ...(body.name && { name: body.name }),
        ...(body.breed && { breed: body.breed }),
        ...(body.registrationNumber !== undefined && { registrationNumber: body.registrationNumber }),
        ...(body.birthDate !== undefined && { birthDate: body.birthDate ? new Date(body.birthDate) : null }),
        ...(body.heroImage && { heroImage: body.heroImage }),
        ...(body.additionalImages !== undefined && { additionalImages: body.additionalImages }),
        ...(body.status && { status: body.status }),
        // Genetic data fields
        ...(body.epdData !== undefined && { epdData: body.epdData }),
        ...(body.geneticMarkers !== undefined && { geneticMarkers: body.geneticMarkers }),
        ...(body.dnaTestResults !== undefined && { dnaTestResults: body.dnaTestResults }),
        ...(body.sireName !== undefined && { sireName: body.sireName }),
        ...(body.damName !== undefined && { damName: body.damName }),
        ...(body.notableAncestors !== undefined && { notableAncestors: body.notableAncestors }),
        // Performance data fields (for Story 2.5)
        ...(body.birthWeight !== undefined && { birthWeight: body.birthWeight }),
        ...(body.weaningWeight !== undefined && { weaningWeight: body.weaningWeight }),
        ...(body.yearlingWeight !== undefined && { yearlingWeight: body.yearlingWeight }),
        ...(body.currentWeight !== undefined && { currentWeight: body.currentWeight }),
        ...(body.frameScore !== undefined && { frameScore: body.frameScore }),
        ...(body.scrotalCircumference !== undefined && { scrotalCircumference: body.scrotalCircumference }),
        ...(body.progenyNotes !== undefined && { progenyNotes: body.progenyNotes }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.availabilityStatus && { availabilityStatus: body.availabilityStatus }),
        ...(body.semenAvailable !== undefined && { semenAvailable: body.semenAvailable }),
        // Archive status
        ...(body.archived !== undefined && { archived: body.archived }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Bull updated successfully',
      bull: updatedBull,
    });
  } catch (error) {
    console.error('Bull update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's ranch
    const ranch = await prisma.ranch.findUnique({
      where: { userId: session.user.id },
    });

    if (!ranch) {
      return NextResponse.json(
        { success: false, message: 'Ranch profile required' },
        { status: 400 }
      );
    }

    // Get bull and verify ownership
    const bull = await prisma.bull.findUnique({
      where: { slug: params.slug },
    });

    if (!bull) {
      return NextResponse.json(
        { success: false, message: 'Bull not found' },
        { status: 404 }
      );
    }

    if (bull.ranchId !== ranch.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - not your bull' },
        { status: 403 }
      );
    }

    // Delete bull
    await prisma.bull.delete({
      where: { id: bull.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Bull deleted successfully',
    });
  } catch (error) {
    console.error('Bull deletion error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
