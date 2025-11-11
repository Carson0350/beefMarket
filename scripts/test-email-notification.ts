/**
 * Test script to trigger inventory change notification
 * 
 * This script:
 * 1. Finds a test bull
 * 2. Creates a favorite for the test email
 * 3. Updates the bull's inventory
 * 4. Triggers the notification email
 * 
 * Run with: npx tsx scripts/test-email-notification.ts
 */

import { prisma } from '../lib/db';
import { sendInventoryChangeEmail } from '../lib/email';

const TEST_EMAIL = 'carson.workflow@gmail.com';

async function testEmailNotification() {
  console.log('🧪 Testing Email Notification\n');

  try {
    // 1. Find a published bull
    console.log('1️⃣ Finding a test bull...');
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

    // 2. Find or create a test user
    console.log('2️⃣ Setting up test user...');
    let testUser = await prisma.user.findUnique({
      where: { email: TEST_EMAIL },
    });

    if (!testUser) {
      console.log(`   Creating test user: ${TEST_EMAIL}`);
      testUser = await prisma.user.create({
        data: {
          email: TEST_EMAIL,
          password: 'test-password-hash', // Not used for this test
          role: 'BREEDER',
        },
      });
      console.log('   ✅ Test user created');
    } else {
      console.log('   ✅ Test user already exists');
    }

    // 3. Create or verify favorite
    console.log('\n3️⃣ Setting up favorite...');
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_bullId: {
          userId: testUser.id,
          bullId: bull.id,
        },
      },
    });

    if (!existingFavorite) {
      await prisma.favorite.create({
        data: {
          userId: testUser.id,
          bullId: bull.id,
          notificationsEnabled: true,
        },
      });
      console.log('   ✅ Favorite created with notifications enabled');
    } else if (!existingFavorite.notificationsEnabled) {
      await prisma.favorite.update({
        where: {
          userId_bullId: {
            userId: testUser.id,
            bullId: bull.id,
          },
        },
        data: { notificationsEnabled: true },
      });
      console.log('   ✅ Notifications enabled for existing favorite');
    } else {
      console.log('   ✅ Favorite already exists with notifications enabled');
    }

    // 4. Update inventory and trigger notification
    console.log('\n4️⃣ Updating inventory and sending notification...');
    const oldInventory = bull.availableStraws;
    const newInventory = oldInventory === 0 ? 10 : oldInventory <= 5 ? 0 : 3;

    console.log(`   Changing inventory: ${oldInventory} → ${newInventory} straws`);

    // Determine change type
    let changeType: 'became_available' | 'running_low' | 'sold_out' | 'restocked' | 'inventory_updated';
    if (oldInventory === 0 && newInventory > 0) {
      changeType = 'became_available';
    } else if (oldInventory > 0 && newInventory === 0) {
      changeType = 'sold_out';
    } else if (newInventory <= 5 && newInventory > 0) {
      changeType = 'running_low';
    } else if (newInventory - oldInventory >= 10) {
      changeType = 'restocked';
    } else {
      changeType = 'inventory_updated';
    }

    console.log(`   Change type: ${changeType}`);

    // Update the bull
    await prisma.bull.update({
      where: { id: bull.id },
      data: { availableStraws: newInventory },
    });

    console.log('   ✅ Inventory updated in database');

    // Send the email
    console.log(`\n5️⃣ Sending email to ${TEST_EMAIL}...`);
    const result = await sendInventoryChangeEmail({
      userEmail: TEST_EMAIL,
      bull: {
        id: bull.id,
        name: bull.name,
        slug: bull.slug,
        heroImage: bull.heroImage,
        ranch: {
          name: bull.ranch.name,
          contactEmail: bull.ranch.contactEmail,
          contactPhone: bull.ranch.contactPhone,
        },
      },
      oldInventory,
      newInventory,
      changeType,
    });

    if (result.success) {
      console.log('   ✅ Email sent successfully!');
      console.log('\n📧 Check your inbox at carson.workflow@gmail.com');
      console.log(`   Subject: ${getSubjectForChangeType(changeType, bull.name)}`);
    } else {
      console.log(`   ❌ Email failed: ${result.error}`);
    }

    console.log('\n✅ Test complete!');
    console.log('\n📊 Summary:');
    console.log(`   Bull: ${bull.name}`);
    console.log(`   Inventory change: ${oldInventory} → ${newInventory}`);
    console.log(`   Change type: ${changeType}`);
    console.log(`   Email sent to: ${TEST_EMAIL}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function getSubjectForChangeType(changeType: string, bullName: string): string {
  switch (changeType) {
    case 'became_available':
      return `🎉 ${bullName} is now available!`;
    case 'sold_out':
      return `⚠️ ${bullName} is sold out`;
    case 'running_low':
      return `⏰ Limited availability: ${bullName}`;
    case 'restocked':
      return `📦 ${bullName} restocked`;
    default:
      return `Inventory update: ${bullName}`;
  }
}

testEmailNotification();
