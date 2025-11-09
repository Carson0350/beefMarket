import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { generateUniqueRanchSlug } from '@/lib/slugify';

export async function POST(request: Request) {
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
        { success: false, message: 'Ranch profile required. Please create your ranch profile first.' },
        { status: 400 }
      );
    }

    const { name, breed, registrationNumber, birthDate, heroImage, additionalImages, status } = await request.json();

    // Validate required fields
    if (!name || !breed) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name and breed' },
        { status: 400 }
      );
    }

    if (!heroImage) {
      return NextResponse.json(
        { success: false, message: 'Hero photo is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['DRAFT', 'PUBLISHED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    // Generate unique slug from bull name
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    let slug = baseSlug;
    let counter = 2;
    
    while (await prisma.bull.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create bull
    const bull = await prisma.bull.create({
      data: {
        ranchId: ranch.id,
        name,
        slug,
        breed,
        registrationNumber: registrationNumber || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        heroImage,
        additionalImages: additionalImages || [],
        status: status || 'DRAFT',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Bull created successfully',
      bull: {
        id: bull.id,
        slug: bull.slug,
        name: bull.name,
        breed: bull.breed,
        status: bull.status,
      },
    });
  } catch (error) {
    console.error('Bull creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
