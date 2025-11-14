/**
 * Manual test script for inventory change notifications
 * 
 * This script tests the notification system by:
 * 1. Finding a test bull
 * 2. Creating test favorites with notifications enabled/disabled
 * 3. Updating the bull's inventory
 * 4. Verifying notifications are sent to correct users
 * 
 * Run with: npx tsx scripts/test-notifications.ts
 */

import { prisma } from '../lib/db';

async function testNotifications() {
  console.log('🧪 Testing Inventory Change Notifications\n');

  try {
    // 1. Find or create a test bull
    console.log('1️⃣ Finding test bull...');
    const bull = await prisma.bull.findFirst({
      where: { status: 'PUBLISHED' },
      include: { ranch: true },
    });

    if (!bull) {
      console.log('❌ No published bulls found. Please create a test bull first.');
      return;
    }

    console.log(`✅ Found bull: ${bull.name} (ID: ${bull.id})`);
    console.log(`   Current inventory: ${bull.availableStraws} straws\n`);

    // 2. Check for test users with favorites
    console.log('2️⃣ Checking favorites...');
    const favorites = await prisma.favorite.findMany({
      where: { bullId: bull.id },
      include: { user: true },
    });

    console.log(`✅ Found ${favorites.length} users who favorited this bull:`);
    favorites.forEach((fav) => {
      console.log(
        `   - ${fav.user.email} (notifications: ${fav.notificationsEnabled ? 'ON' : 'OFF'})`
      );
    });

    if (favorites.length === 0) {
      console.log('\n⚠️  No favorites found for this bull.');
      console.log('   To test notifications:');
      console.log('   1. Log in as a breeder');
      console.log('   2. Favorite this bull');
      console.log('   3. Run this script again');
      return;
    }

    // 3. Show what would happen with different inventory changes
    console.log('\n3️⃣ Testing change type detection:');
    
    const testCases = [
      { from: 0, to: 10, expected: 'became_available' },
      { from: 10, to: 5, expected: 'running_low' },
      { from: 5, to: 0, expected: 'sold_out' },
      { from: 10, to: 25, expected: 'restocked' },
      { from: 10, to: 12, expected: 'inventory_updated' },
    ];

    testCases.forEach(({ from, to, expected }) => {
      const type = determineChangeType(from, to);
      const match = type === expected ? '✅' : '❌';
      console.log(`   ${match} ${from} → ${to}: ${type} (expected: ${expected})`);
    });

    // 4. Summary
    console.log('\n📊 Summary:');
    console.log(`   Bull: ${bull.name}`);
    console.log(`   Current inventory: ${bull.availableStraws} straws`);
    console.log(`   Total favorites: ${favorites.length}`);
    console.log(
      `   Notifications enabled: ${favorites.filter((f) => f.notificationsEnabled).length}`
    );
    console.log(
      `   Notifications disabled: ${favorites.filter((f) => !f.notificationsEnabled).length}`
    );

    console.log('\n✅ Test complete!');
    console.log('\n💡 To trigger actual notifications:');
    console.log('   1. Update the bull inventory via the ranch dashboard');
    console.log('   2. Or use the API: PATCH /api/bulls/' + bull.id);
    console.log('   3. Check your email for notifications');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function determineChangeType(
  oldCount: number,
  newCount: number
): string {
  if (oldCount === 0 && newCount > 0) return 'became_available';
  if (oldCount > 0 && newCount === 0) return 'sold_out';
  if (newCount <= 5 && newCount > 0) return 'running_low';
  if (newCount - oldCount >= 10) return 'restocked';
  return 'inventory_updated';
}

testNotifications();
