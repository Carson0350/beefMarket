import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function checkUser() {
  const email = 'carson.workflow4@gmail.com';
  
  console.log(`Checking user: ${email}\n`);
  
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    console.log('❌ User not found in database');
    return;
  }
  
  console.log('✅ User found:');
  console.log('ID:', user.id);
  console.log('Email:', user.email);
  console.log('Role:', user.role);
  console.log('Email Verified:', user.emailVerified);
  console.log('Created:', user.createdAt);
  console.log('Password hash length:', user.password.length);
  console.log('Password hash starts with:', user.password.substring(0, 10));
  
  // Test password verification
  const testPassword = 'Test1234!'; // Replace with the password you used
  console.log('\nTesting password verification...');
  const isValid = await bcrypt.compare(testPassword, user.password);
  console.log('Password valid:', isValid);
  
  await prisma.$disconnect();
}

checkUser();
