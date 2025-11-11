import { prisma } from '../lib/db';

async function checkBulls() {
  try {
    const bulls = await prisma.bull.findMany({
      select: {
        name: true,
        status: true,
        archived: true,
        slug: true,
      },
    });

    console.log(`Total bulls in database: ${bulls.length}`);
    console.log('\nBulls:');
    bulls.forEach((bull) => {
      console.log(`- ${bull.name} (${bull.status}, archived: ${bull.archived})`);
    });

    const publishedBulls = bulls.filter(
      (b) => b.status === 'PUBLISHED' && !b.archived
    );
    console.log(`\nPublished, non-archived bulls: ${publishedBulls.length}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBulls();
