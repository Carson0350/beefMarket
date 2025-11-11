import { prisma } from '../lib/db';

async function createMultipleBulls() {
  try {
    const ranch = await prisma.ranch.findUnique({
      where: { slug: 'premium-cattle-ranch' },
    });

    if (!ranch) {
      console.error('Test ranch not found! Make sure "premium-cattle-ranch" exists.');
      return;
    }

    const bulls = [
      {
        slug: 'red-angus-champion',
        name: 'Red Angus Champion',
        breed: 'Red Angus',
        epdData: { birthWeight: 3.0, weaningWeight: 50, yearlingWeight: 85 },
        availableStraws: 15,
        pricePerStraw: 75,
      },
      {
        slug: 'hereford-king',
        name: 'Hereford King',
        breed: 'Hereford',
        epdData: { birthWeight: 2.8, weaningWeight: 48, yearlingWeight: 82 },
        availableStraws: 8,
        pricePerStraw: 60,
      },
      {
        slug: 'charolais-titan',
        name: 'Charolais Titan',
        breed: 'Charolais',
        epdData: { birthWeight: 3.5, weaningWeight: 55, yearlingWeight: 90 },
        availableStraws: 0,
        pricePerStraw: 100,
      },
      {
        slug: 'simmental-supreme',
        name: 'Simmental Supreme',
        breed: 'Simmental',
        epdData: { birthWeight: 3.2, weaningWeight: 52, yearlingWeight: 88 },
        availableStraws: 30,
        pricePerStraw: 80,
      },
    ];

    for (const bullData of bulls) {
      const bull = await prisma.bull.create({
        data: {
          ranchId: ranch.id,
          slug: bullData.slug,
          name: bullData.name,
          breed: bullData.breed,
          status: 'PUBLISHED',
          heroImage: 'https://res.cloudinary.com/demo/image/upload/v1/samples/animals/cow.jpg',
          birthDate: new Date('2020-05-10'),
          registrationNumber: `${bullData.breed.toUpperCase()}-2020-${Math.floor(Math.random() * 1000)}`,
          epdData: bullData.epdData,
          availableStraws: bullData.availableStraws,
          pricePerStraw: bullData.pricePerStraw,
          archived: false,
        },
      });
      console.log(`Created: ${bull.name}`);
    }

    console.log('\nAll test bulls created successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMultipleBulls();
