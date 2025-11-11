import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const skip = (page - 1) * limit;

    // Parse filter parameters
    const breeds = searchParams.get('breeds')?.split(',').filter(Boolean) || [];
    const states = searchParams.get('states')?.split(',').filter(Boolean) || [];
    const availability = searchParams.get('availability')?.split(',').filter(Boolean) || [];
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null;
    const includeNoPriceListings = searchParams.get('includeNoPriceListings') === 'true';
    
    // EPD filters
    const minBirthWeight = searchParams.get('minBirthWeight') ? parseFloat(searchParams.get('minBirthWeight')!) : null;
    const maxBirthWeight = searchParams.get('maxBirthWeight') ? parseFloat(searchParams.get('maxBirthWeight')!) : null;
    const minWeaningWeight = searchParams.get('minWeaningWeight') ? parseFloat(searchParams.get('minWeaningWeight')!) : null;
    const maxWeaningWeight = searchParams.get('maxWeaningWeight') ? parseFloat(searchParams.get('maxWeaningWeight')!) : null;
    const minYearlingWeight = searchParams.get('minYearlingWeight') ? parseFloat(searchParams.get('minYearlingWeight')!) : null;
    const maxYearlingWeight = searchParams.get('maxYearlingWeight') ? parseFloat(searchParams.get('maxYearlingWeight')!) : null;

    // Build where clause
    const where: Prisma.BullWhereInput = {
      status: 'PUBLISHED',
      archived: false,
    };

    // Breed filter
    if (breeds.length > 0) {
      where.breed = { in: breeds };
    }

    // Location filter (ranch state)
    if (states.length > 0) {
      where.ranch = { state: { in: states } };
    }

    // Availability filter
    if (availability.length > 0) {
      const availabilityConditions: Prisma.BullWhereInput[] = [];
      
      if (availability.includes('in-stock')) {
        availabilityConditions.push({ availableStraws: { gte: 10 } });
      }
      if (availability.includes('limited')) {
        availabilityConditions.push({ availableStraws: { gte: 1, lt: 10 } });
      }
      if (availability.includes('sold-out')) {
        availabilityConditions.push({ availableStraws: 0 });
      }

      if (availabilityConditions.length > 0) {
        where.OR = availabilityConditions;
      }
    }

    // Price filter
    if (minPrice !== null || maxPrice !== null) {
      const priceConditions: Prisma.BullWhereInput[] = [];
      
      if (minPrice !== null && maxPrice !== null) {
        priceConditions.push({ 
          pricePerStraw: { gte: minPrice, lte: maxPrice } 
        });
      } else if (minPrice !== null) {
        priceConditions.push({ pricePerStraw: { gte: minPrice } });
      } else if (maxPrice !== null) {
        priceConditions.push({ pricePerStraw: { lte: maxPrice } });
      }

      if (includeNoPriceListings) {
        priceConditions.push({ pricePerStraw: null });
      }

      if (priceConditions.length > 0) {
        where.AND = where.AND || [];
        (where.AND as Prisma.BullWhereInput[]).push({ OR: priceConditions });
      }
    }

    // EPD filters (JSON field queries)
    const epdConditions: Prisma.BullWhereInput[] = [];
    
    if (minBirthWeight !== null || maxBirthWeight !== null) {
      const condition: any = { path: ['birthWeight'] };
      if (minBirthWeight !== null) condition.gte = minBirthWeight;
      if (maxBirthWeight !== null) condition.lte = maxBirthWeight;
      epdConditions.push({ epdData: condition });
    }
    
    if (minWeaningWeight !== null || maxWeaningWeight !== null) {
      const condition: any = { path: ['weaningWeight'] };
      if (minWeaningWeight !== null) condition.gte = minWeaningWeight;
      if (maxWeaningWeight !== null) condition.lte = maxWeaningWeight;
      epdConditions.push({ epdData: condition });
    }
    
    if (minYearlingWeight !== null || maxYearlingWeight !== null) {
      const condition: any = { path: ['yearlingWeight'] };
      if (minYearlingWeight !== null) condition.gte = minYearlingWeight;
      if (maxYearlingWeight !== null) condition.lte = maxYearlingWeight;
      epdConditions.push({ epdData: condition });
    }

    if (epdConditions.length > 0) {
      where.AND = where.AND || [];
      (where.AND as Prisma.BullWhereInput[]).push(...epdConditions);
    }

    // Fetch published, non-archived bulls with ranch data
    const [bulls, totalCount] = await Promise.all([
      prisma.bull.findMany({
        where,
        include: {
          ranch: {
            select: {
              name: true,
              slug: true,
              state: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.bull.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      bulls,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching bulls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bulls' },
      { status: 500 }
    );
  }
}
