import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function createTestRanchOwner() {
  const email = 'ranch@test.com';
  const password = 'Test1234!';
  const ranchName = 'Test Ranch';
  
  console.log('Creating test ranch owner account...\n');
  
  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });
  
  if (existing) {
    console.log('❌ User with this email already exists');
    console.log(`Email: ${email}`);
    console.log(`Role: ${existing.role}`);
    console.log('\nUse a different email or delete the existing user first.');
    await prisma.$disconnect();
    return;
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Create user and ranch
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'RANCH_OWNER',
      emailVerified: new Date(), // Mark as verified for testing
      ranch: {
        create: {
          name: ranchName,
          slug: 'test-ranch',
          state: 'TX',
          contactEmail: email,
          contactPhone: '555-0100',
        },
      },
    },
    include: {
      ranch: true,
    },
  });
  
  console.log('✅ Test ranch owner created successfully!\n');
  console.log('='.repeat(60));
  console.log('LOGIN CREDENTIALS:');
  console.log('='.repeat(60));
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Ranch:    ${user.ranch?.name}`);
  console.log('');
  console.log('Login at: http://localhost:3000/login');
  console.log('Dashboard: http://localhost:3000/dashboard/inquiries');
  console.log('='.repeat(60));
  console.log('');
  
  await prisma.$disconnect();
}

createTestRanchOwner();
