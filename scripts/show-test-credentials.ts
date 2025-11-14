import { prisma } from '@/lib/db';

async function showTestCredentials() {
  console.log('='.repeat(60));
  console.log('TEST ACCOUNT CREDENTIALS');
  console.log('='.repeat(60));
  console.log('');
  
  // Check for ranch owners
  const ranchOwners = await prisma.user.findMany({
    where: { role: 'RANCH_OWNER' },
    include: {
      ranch: true,
    },
  });
  
  if (ranchOwners.length > 0) {
    console.log('🏠 RANCH OWNER ACCOUNTS:');
    console.log('-'.repeat(60));
    ranchOwners.forEach((user, index) => {
      console.log(`\n${index + 1}. Ranch: ${user.ranch?.name || 'No ranch'}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: [Check with developer - likely "Test1234!" or similar]`);
      console.log(`   Dashboard: http://localhost:3000/dashboard/inquiries`);
    });
    console.log('');
  }
  
  // Check for breeders
  const breeders = await prisma.user.findMany({
    where: { role: 'BREEDER' },
    take: 3,
  });
  
  if (breeders.length > 0) {
    console.log('\n👤 BREEDER ACCOUNTS:');
    console.log('-'.repeat(60));
    breeders.forEach((user, index) => {
      console.log(`\n${index + 1}. Email: ${user.email}`);
      console.log(`   Password: [Check with developer]`);
    });
    console.log('');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('NOTE: If you don\'t know the password, you can:');
  console.log('1. Sign up a new ranch owner at /signup');
  console.log('2. Use the password reset flow');
  console.log('3. Create a new test user with a known password');
  console.log('='.repeat(60));
  console.log('');
  
  await prisma.$disconnect();
}

showTestCredentials();
