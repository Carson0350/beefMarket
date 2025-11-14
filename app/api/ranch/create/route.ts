import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { generateUniqueRanchSlug } from '@/lib/slugify';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check email verification - TEMPORARILY DISABLED FOR DEVELOPMENT
    // if (!session.user.emailVerified) {
    //   return NextResponse.json(
    //     { success: false, message: 'Email must be verified before creating a ranch profile' },
    //     { status: 403 }
    //   );
    // }

    // Check if user already has a ranch
    const existingRanch = await prisma.ranch.findUnique({
      where: { userId: session.user.id },
    });

    if (existingRanch) {
      return NextResponse.json(
        { success: false, message: 'You already have a ranch profile' },
        { status: 400 }
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

    // Validate phone format (basic validation)
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

    // Generate unique slug
    const slug = await generateUniqueRanchSlug(name);

    // Create ranch
    const ranch = await prisma.ranch.create({
      data: {
        userId: session.user.id,
        name,
        slug,
        state,
        contactEmail,
        contactPhone,
        about: about || null,
        websiteUrl: websiteUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Ranch profile created successfully',
      ranch: {
        id: ranch.id,
        name: ranch.name,
        slug: ranch.slug,
        state: ranch.state,
        contactEmail: ranch.contactEmail,
        contactPhone: ranch.contactPhone,
        about: ranch.about,
        websiteUrl: ranch.websiteUrl,
      },
    });
  } catch (error) {
    console.error('Ranch creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
