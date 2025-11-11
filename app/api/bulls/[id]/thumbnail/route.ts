import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bull = await prisma.bull.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        heroImage: true,
        breed: true,
      },
    });

    if (!bull) {
      return NextResponse.json(
        { error: 'Bull not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(bull);
  } catch (error) {
    console.error('Error fetching bull thumbnail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bull data' },
      { status: 500 }
    );
  }
}
