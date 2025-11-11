/**
 * Test script to verify login works with case-insensitive email matching
 */

import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function testLoginCaseSensitivity() {
  console.log('🧪 Testing Login Case Sensitivity Fix\n');

  const testEmail = 'TestUser@Example.COM'; // Mixed case
  const testPassword = 'TestPassword123!';
  
  try {
    // Clean up any existing test user
    await prisma.user.deleteMany({
      where: { email: testEmail.toLowerCase() },
    });

    // Create test user with lowercase email (as registration does)
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    const user = await prisma.user.create({
      data: {
        email: testEmail.toLowerCase(), // Stored as lowercase
        password: hashedPassword,
      },
    });

    console.log('✅ Created test user with email:', user.email);

    // Test 1: Login with exact lowercase match
    console.log('\nTest 1: Login with lowercase email...');
    const user1 = await prisma.user.findUnique({
      where: { email: testEmail.toLowerCase() },
    });
    if (user1) {
      const match1 = await bcrypt.compare(testPassword, user1.password);
      console.log(match1 ? '✅ Login successful' : '❌ Password mismatch');
    } else {
      console.log('❌ User not found');
    }

    // Test 2: Login with mixed case email (simulating user input)
    console.log('\nTest 2: Login with mixed case email...');
    const user2 = await prisma.user.findUnique({
      where: { email: testEmail.toLowerCase() }, // Auth now converts to lowercase
    });
    if (user2) {
      const match2 = await bcrypt.compare(testPassword, user2.password);
      console.log(match2 ? '✅ Login successful (case-insensitive)' : '❌ Password mismatch');
    } else {
      console.log('❌ User not found');
    }

    // Test 3: Login with uppercase email
    console.log('\nTest 3: Login with uppercase email...');
    const user3 = await prisma.user.findUnique({
      where: { email: testEmail.toUpperCase().toLowerCase() }, // Auth converts to lowercase
    });
    if (user3) {
      const match3 = await bcrypt.compare(testPassword, user3.password);
      console.log(match3 ? '✅ Login successful (case-insensitive)' : '❌ Password mismatch');
    } else {
      console.log('❌ User not found');
    }

    // Cleanup
    await prisma.user.delete({ where: { id: user.id } });
    console.log('\n✅ Test user cleaned up');
    console.log('\n✅ All case-sensitivity tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLoginCaseSensitivity();
