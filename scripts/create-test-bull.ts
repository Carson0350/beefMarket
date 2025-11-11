import { prisma } from '../lib/db';

async function createTestBull() {
  try {
    // Get the test ranch
    const ranch = await prisma.ranch.findUnique({
      where: { slug: 'wagner-ranch' },
    });

    if (!ranch) {
      console.error('Test ranch not found!');
      return;
    }

    // Create a published test bull
    const bull = await prisma.bull.create({
      data: {
        ranchId: ranch.id,
        slug: 'champion-angus-001',
        name: 'Champion Black Angus',
        breed: 'Angus',
        status: 'PUBLISHED',
        heroImage: 'https://res.cloudinary.com/demo/image/upload/v1/samples/animals/cow.jpg',
        birthDate: new Date('2021-03-15'),
        registrationNumber: 'ANG-2021-001',
        epdData: {
          birthWeight: 2.5,
          weaningWeight: 45,
          yearlingWeight: 80,
        },
        availableStraws: 25,
        pricePerStraw: 50,
        archived: false,
      },
    });

    console.log('Created test bull:', bull.name);
    console.log('Slug:', bull.slug);
    console.log('Status:', bull.status);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestBull();
