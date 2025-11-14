import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TARGET_USER_ID = 'cmhyyqfa30000rtaq3gpcocag';

async function main() {
  console.log(`🔍 Checking bulls for user: ${TARGET_USER_ID}\n`);

  // Find the ranch for this user
  const ranch = await prisma.ranch.findUnique({
    where: { userId: TARGET_USER_ID },
    select: {
      id: true,
      name: true,
      bulls: {
        select: {
          id: true,
          name: true,
          status: true,
          slug: true,
        },
      },
    },
  });

  if (!ranch) {
    console.log('❌ No ranch found for this user.');
    return;
  }

  console.log(`✅ Ranch: ${ranch.name}`);
  console.log(`   Total bulls: ${ranch.bulls.length}\n`);

  if (ranch.bulls.length === 0) {
    console.log('❌ No bulls found. Please create some bulls first.');
    return;
  }

  console.log('📋 Bulls:\n');
  ranch.bulls.forEach((bull, index) => {
    console.log(`${index + 1}. ${bull.name}`);
    console.log(`   Status: ${bull.status}`);
    console.log(`   Slug: ${bull.slug}`);
    console.log(`   ID: ${bull.id}\n`);
  });

  const draftBulls = ranch.bulls.filter((b) => b.status === 'DRAFT');
  const publishedBulls = ranch.bulls.filter((b) => b.status === 'PUBLISHED');

  console.log(`\n📊 Summary:`);
  console.log(`   Published: ${publishedBulls.length}`);
  console.log(`   Draft: ${draftBulls.length}`);

  if (draftBulls.length > 0) {
    console.log(`\n💡 To publish draft bulls, run:`);
    console.log(`   npx tsx scripts/publish-all-bulls.ts`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
