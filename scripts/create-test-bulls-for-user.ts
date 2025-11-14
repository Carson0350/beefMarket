import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TARGET_USER_ID = 'cmhyyqfa30000rtaq3gpcocag';

const testBulls = [
  {
    name: 'Black Thunder',
    breed: 'Angus',
    registrationNumber: 'ANG123456',
    birthDate: new Date('2020-03-15'),
    availableStraws: 25,
    pricePerStraw: 45,
    birthWeight: 85,
    weaningWeight: 650,
    yearlingWeight: 1150,
  },
  {
    name: 'Red Warrior',
    breed: 'Red Angus',
    registrationNumber: 'RA789012',
    birthDate: new Date('2019-05-20'),
    availableStraws: 18,
    pricePerStraw: 55,
    birthWeight: 82,
    weaningWeight: 680,
    yearlingWeight: 1200,
  },
  {
    name: 'Hereford King',
    breed: 'Hereford',
    registrationNumber: 'HER345678',
    birthDate: new Date('2021-02-10'),
    availableStraws: 30,
    pricePerStraw: 40,
    birthWeight: 88,
    weaningWeight: 640,
    yearlingWeight: 1100,
  },
  {
    name: 'Charolais Champion',
    breed: 'Charolais',
    registrationNumber: 'CHA901234',
    birthDate: new Date('2020-08-05'),
    availableStraws: 15,
    pricePerStraw: 60,
    birthWeight: 95,
    weaningWeight: 720,
    yearlingWeight: 1280,
  },
  {
    name: 'Simmental Star',
    breed: 'Simmental',
    registrationNumber: 'SIM567890',
    birthDate: new Date('2019-11-12'),
    availableStraws: 22,
    pricePerStraw: 50,
    birthWeight: 90,
    weaningWeight: 700,
    yearlingWeight: 1220,
  },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log(`🚀 Creating test bulls for user: ${TARGET_USER_ID}\n`);

  // Find the ranch for this user
  const ranch = await prisma.ranch.findUnique({
    where: { userId: TARGET_USER_ID },
    select: {
      id: true,
      name: true,
    },
  });

  if (!ranch) {
    console.log('❌ No ranch found for this user.');
    console.log('   Please create a ranch first.');
    return;
  }

  console.log(`✅ Found ranch: ${ranch.name}\n`);
  console.log(`📝 Creating ${testBulls.length} test bulls...\n`);

  for (const bullData of testBulls) {
    const timestamp = Date.now();
    const slug = `${generateSlug(bullData.name)}-${timestamp}`;
    
    const bull = await prisma.bull.create({
      data: {
        ranchId: ranch.id,
        name: bullData.name,
        slug,
        breed: bullData.breed,
        registrationNumber: bullData.registrationNumber,
        birthDate: bullData.birthDate,
        availableStraws: bullData.availableStraws,
        pricePerStraw: bullData.pricePerStraw,
        birthWeight: bullData.birthWeight,
        weaningWeight: bullData.weaningWeight,
        yearlingWeight: bullData.yearlingWeight,
        status: 'PUBLISHED', // Publish immediately
        archived: false,
        heroImage: 'https://via.placeholder.com/600x400?text=Bull+Photo', // Placeholder image
        notableAncestors: [],
        epdData: {},
      },
    });

    console.log(`  ✅ Created: ${bull.name} (${bull.breed})`);
    console.log(`     Status: PUBLISHED`);
    console.log(`     Slug: ${bull.slug}`);
    console.log(`     Available: ${bull.availableStraws} straws @ $${bull.pricePerStraw}\n`);
  }

  console.log(`\n🎉 Successfully created ${testBulls.length} bulls!`);
  console.log(`\n🔗 View bulls at: http://localhost:3000/bulls`);
  console.log(`\n💡 Now run: npx tsx scripts/create-inquiries-for-user.ts`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
