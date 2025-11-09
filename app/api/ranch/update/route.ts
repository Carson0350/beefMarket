import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function PUT(request: Request) {
  try {
    // Check authentication
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
        { success: false, message: 'Ranch profile not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const { name, state, contactEmail, contactPhone, about, websiteUrl } = await request.json();

    // Validate required fields
    if (!name || !state || !contactEmail || !contactPhone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name, state, contactEmail, contactPhone' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    if (!phoneRegex.test(contactPhone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate website URL if provided
    if (websiteUrl) {
      try {
        const url = new URL(websiteUrl);
        if (!url.protocol.startsWith('http')) {
          throw new Error('Invalid protocol');
        }
      } catch (error) {
        return NextResponse.json(
          { success: false, message: 'Invalid website URL format' },
          { status: 400 }
        );
      }
    }

    // Validate about character limit
    if (about && about.length > 500) {
      return NextResponse.json(
        { success: false, message: 'About section must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Update ranch (note: slug is not updated)
    const updatedRanch = await prisma.ranch.update({
      where: { id: ranch.id },
      data: {
        name,
        state,
        contactEmail,
        contactPhone,
        about: about || null,
        websiteUrl: websiteUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Ranch profile updated successfully',
      ranch: {
        id: updatedRanch.id,
        name: updatedRanch.name,
        slug: updatedRanch.slug,
        state: updatedRanch.state,
        contactEmail: updatedRanch.contactEmail,
        contactPhone: updatedRanch.contactPhone,
        about: updatedRanch.about,
        websiteUrl: updatedRanch.websiteUrl,
      },
    });
  } catch (error) {
    console.error('Ranch update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
