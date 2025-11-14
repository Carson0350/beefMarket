import { prisma } from '@/lib/db';

async function checkRanchOwners() {
  console.log('Checking for ranch owners...\n');
  
  const ranchOwners = await prisma.user.findMany({
    where: { role: 'RANCH_OWNER' },
    include: {
      ranch: true,
    },
  });
  
  if (ranchOwners.length === 0) {
    console.log('❌ No ranch owners found in database\n');
    console.log('To test the inquiry dashboard, you need to:');
    console.log('1. Sign up as a ranch owner at /signup');
    console.log('2. Or run a script to create a test ranch owner\n');
    return;
  }
  
  console.log(`✅ Found ${ranchOwners.length} ranch owner(s):\n`);
  
  ranchOwners.forEach((user, index) => {
    console.log(`${index + 1}. Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Ranch: ${user.ranch?.name || 'No ranch associated'}`);
    console.log(`   Email Verified: ${user.emailVerified ? 'Yes' : 'No'}`);
    console.log('');
  });
  
  await prisma.$disconnect();
}

checkRanchOwners();
