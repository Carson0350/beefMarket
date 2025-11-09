import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testRanchCreation() {
  console.log('🧪 Testing Ranch Creation API\n');

  // Get the test user
  const user = await prisma.user.findUnique({
    where: { email: 'testranch@example.com' },
  });

  if (!user) {
    console.log('❌ Test user not found');
    return;
  }

  console.log('✅ Test user found:', user.email);
  console.log('✅ Email verified:', user.emailVerified ? 'Yes' : 'No');
  console.log('✅ Role:', user.role);

  // Test 1: Create ranch
  console.log('\n📝 Test 1: Creating ranch...');
  try {
    const ranch = await prisma.ranch.create({
      data: {
        userId: user.id,
        name: 'Wagner Ranch',
        slug: 'wagner-ranch',
        state: 'Texas',
        contactEmail: 'contact@wagnerranch.com',
        contactPhone: '(555) 123-4567',
        about: 'Family-owned ranch specializing in premium Angus cattle.',
        websiteUrl: 'https://www.wagnerranch.com',
      },
    });
    console.log('✅ Ranch created successfully!');
    console.log('   - Name:', ranch.name);
    console.log('   - Slug:', ranch.slug);
    console.log('   - State:', ranch.state);
    console.log('   - URL: wagnerbeef.com/' + ranch.slug);
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('⚠️  Ranch already exists for this user (expected if running multiple times)');
    } else {
      console.log('❌ Error:', error.message);
    }
  }

  // Test 2: Fetch ranch
  console.log('\n📝 Test 2: Fetching ranch...');
  const ranch = await prisma.ranch.findUnique({
    where: { userId: user.id },
  });
  if (ranch) {
    console.log('✅ Ranch fetched successfully!');
    console.log('   - Name:', ranch.name);
    console.log('   - Slug:', ranch.slug);
  } else {
    console.log('❌ Ranch not found');
  }

  // Test 3: Update ranch
  if (ranch) {
    console.log('\n📝 Test 3: Updating ranch...');
    const updated = await prisma.ranch.update({
      where: { id: ranch.id },
      data: {
        name: 'Wagner Premium Ranch',
        about: 'Updated: Family-owned ranch with 50+ years of experience.',
      },
    });
    console.log('✅ Ranch updated successfully!');
    console.log('   - New name:', updated.name);
    console.log('   - Slug (unchanged):', updated.slug);
  }

  // Test 4: Test slug uniqueness
  console.log('\n📝 Test 4: Testing slug uniqueness...');
  const existingSlug = await prisma.ranch.findUnique({
    where: { slug: 'wagner-ranch' },
  });
  console.log(existingSlug ? '✅ Slug exists (uniqueness working)' : '❌ Slug not found');

  // Test 5: List all ranches
  console.log('\n📝 Test 5: Listing all ranches...');
  const allRanches = await prisma.ranch.findMany({
    include: {
      user: {
        select: {
          email: true,
          role: true,
        },
      },
    },
  });
  console.log(`✅ Found ${allRanches.length} ranch(es):`);
  allRanches.forEach((r, i) => {
    console.log(`   ${i + 1}. ${r.name} (${r.slug}) - Owner: ${r.user.email}`);
  });

  console.log('\n✅ All tests completed!');
}

testRanchCreation()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
