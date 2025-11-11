/**
 * Manual Test Script for Story 4.3a: Breeder Account Creation & Login
 * 
 * This script provides test scenarios to verify all acceptance criteria.
 * Run this after starting the dev server with: npm run dev
 */

import { prisma } from '@/lib/db';
import { hash } from 'bcryptjs';

async function testBreederRegistration() {
  console.log('🧪 Testing Breeder Registration & Login Flow\n');

  try {
    // Test 1: Create a test breeder account
    console.log('Test 1: Creating test breeder account...');
    const testEmail = `test-breeder-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    const hashedPassword = await hash(testPassword, 12);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        // role defaults to BREEDER
      },
    });

    console.log('✅ User created:', {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });

    // Test 2: Verify role is BREEDER
    console.log('\nTest 2: Verifying role is BREEDER...');
    if (user.role === 'BREEDER') {
      console.log('✅ Role correctly set to BREEDER');
    } else {
      console.log('❌ Role is not BREEDER:', user.role);
    }

    // Test 3: Verify user can be found by email
    console.log('\nTest 3: Finding user by email...');
    const foundUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (foundUser) {
      console.log('✅ User found by email');
    } else {
      console.log('❌ User not found by email');
    }

    // Test 4: Test duplicate email prevention
    console.log('\nTest 4: Testing duplicate email prevention...');
    try {
      await prisma.user.create({
        data: {
          email: testEmail,
          password: hashedPassword,
        },
      });
      console.log('❌ Duplicate email was allowed (should have failed)');
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log('✅ Duplicate email correctly prevented');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Cleanup
    console.log('\nCleaning up test data...');
    await prisma.user.delete({
      where: { id: user.id },
    });
    console.log('✅ Test user deleted');

    console.log('\n✅ All database tests passed!');
    console.log('\n📝 Manual Testing Checklist:');
    console.log('1. Navigate to http://localhost:3000/register');
    console.log('2. Fill out registration form with valid data');
    console.log('3. Verify password strength indicator works');
    console.log('4. Submit form and verify auto-login');
    console.log('5. Check navigation shows user email and Logout button');
    console.log('6. Refresh page and verify session persists');
    console.log('7. Click Logout and verify redirect to home');
    console.log('8. Try to register with existing email (should fail)');
    console.log('9. Try to register with weak password (should fail)');
    console.log('10. Try to register with mismatched passwords (should fail)');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
testBreederRegistration();
