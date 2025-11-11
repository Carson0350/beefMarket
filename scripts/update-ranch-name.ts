import { prisma } from '../lib/db';

async function updateRanchName() {
  try {
    // Find the Wagner ranch
    const ranch = await prisma.ranch.findUnique({
      where: { slug: 'wagner-ranch' },
    });

    if (!ranch) {
      console.log('❌ Ranch with slug "wagner-ranch" not found');
      return;
    }

    console.log(`📝 Found ranch: ${ranch.name}`);
    console.log(`   Current slug: ${ranch.slug}`);

    // Update to generic name
    const updated = await prisma.ranch.update({
      where: { id: ranch.id },
      data: {
        name: 'Premium Cattle Ranch',
        slug: 'premium-cattle-ranch',
      },
    });

    console.log(`✅ Updated ranch name to: ${updated.name}`);
    console.log(`✅ Updated slug to: ${updated.slug}`);
    console.log('\n✨ All bulls will now show "Premium Cattle Ranch" instead of "Wagner Premium Ranch"');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRanchName();
