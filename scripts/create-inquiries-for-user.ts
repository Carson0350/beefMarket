import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TARGET_USER_ID = 'cmhyyqfa30000rtaq3gpcocag';

const testInquiries = [
  {
    breederName: 'John Smith',
    breederEmail: 'john.smith@example.com',
    breederPhone: '(555) 123-4567',
    message: "I'm interested in this bull for my breeding program. Can you provide more information about his progeny performance and availability?",
  },
  {
    breederName: 'Sarah Johnson',
    breederEmail: 'sarah.j@farmmail.com',
    breederPhone: '(555) 234-5678',
    message: "I'm looking to purchase semen straws for my herd. What's the current price per straw and how many are available?",
  },
  {
    breederName: 'Mike Wilson',
    breederEmail: 'mike.wilson@ranchmail.com',
    breederPhone: null,
    message: "I've been following this bull's performance data and I'm very impressed. I'd like to discuss bulk pricing for 10+ straws. Please contact me at your earliest convenience.",
  },
  {
    breederName: 'Emily Davis',
    breederEmail: 'emily.davis@cattleranch.com',
    breederPhone: '(555) 345-6789',
    message: "Hi, I'm interested in this bull for AI breeding. Can you tell me more about his calving ease and temperament? Also, do you offer any guarantees on the semen quality?",
  },
  {
    breederName: 'Robert Brown',
    breederEmail: 'rbrown@livestockfarm.com',
    breederPhone: '(555) 456-7890',
    message: "I'm expanding my operation and looking for quality genetics. This bull looks like a great fit. What's the shipping process and timeline?",
  },
  {
    breederName: 'Jennifer Martinez',
    breederEmail: 'jmartinez@beefpro.com',
    breederPhone: '(555) 567-8901',
    message: "I'm interested in purchasing semen from this bull. Can you provide EPD data and any recent progeny photos? Also, what's your refund policy?",
  },
  {
    breederName: 'David Anderson',
    breederEmail: 'danderson@farmersco.com',
    breederPhone: null,
    message: "Looking to improve my herd genetics. This bull has excellent numbers. Do you have any special pricing for first-time buyers?",
  },
  {
    breederName: 'Lisa Thompson',
    breederEmail: 'lisa.t@ranchlife.com',
    breederPhone: '(555) 678-9012',
    message: "I'm very interested in this bull. I've used similar genetics before with great success. Can we schedule a call to discuss details?",
  },
  {
    breederName: 'Tom Richards',
    breederEmail: 'trichards@beefranch.com',
    breederPhone: '(555) 789-0123',
    message: "This bull has outstanding EPDs. I'm interested in purchasing multiple straws. Do you offer volume discounts?",
  },
  {
    breederName: 'Amanda White',
    breederEmail: 'awhite@livestock.com',
    breederPhone: '(555) 890-1234',
    message: "I saw this bull at a show last year and was very impressed. Is he still available for AI? What's the current inventory?",
  },
];

async function main() {
  console.log(`🚀 Creating test inquiries for user: ${TARGET_USER_ID}\n`);

  // Find the ranch for this user
  const ranch = await prisma.ranch.findUnique({
    where: { userId: TARGET_USER_ID },
    select: {
      id: true,
      name: true,
      bulls: {
        where: {
          status: 'PUBLISHED',
        },
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!ranch) {
    console.log('❌ No ranch found for this user.');
    console.log('   Make sure the user has created a ranch.');
    return;
  }

  console.log(`✅ Found ranch: ${ranch.name}`);
  console.log(`   Bulls: ${ranch.bulls.length} published\n`);

  if (ranch.bulls.length === 0) {
    console.log('❌ No published bulls found.');
    console.log('   Please add and publish some bulls first.');
    return;
  }

  let totalCreated = 0;

  // Create inquiries for each bull
  for (const bull of ranch.bulls) {
    // Create 3-5 inquiries per bull
    const numInquiries = Math.floor(Math.random() * 3) + 3; // 3-5 inquiries
    
    console.log(`📧 Creating ${numInquiries} inquiries for ${bull.name}...`);
    
    for (let i = 0; i < numInquiries; i++) {
      const inquiryData = testInquiries[totalCreated % testInquiries.length];
      
      // Randomize status (more unread for testing)
      const statuses = ['UNREAD', 'UNREAD', 'UNREAD', 'UNREAD', 'RESPONDED', 'ARCHIVED'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Create inquiry with varied timestamps (last 14 days)
      const daysAgo = Math.floor(Math.random() * 14);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      createdAt.setHours(Math.floor(Math.random() * 24));
      createdAt.setMinutes(Math.floor(Math.random() * 60));

      await prisma.inquiry.create({
        data: {
          bullId: bull.id,
          ranchId: ranch.id,
          breederName: inquiryData.breederName,
          breederEmail: inquiryData.breederEmail,
          breederPhone: inquiryData.breederPhone,
          message: `I'm interested in ${bull.name}. ${inquiryData.message}`,
          status: status as any,
          createdAt,
        },
      });

      console.log(`  ✅ ${status} - ${inquiryData.breederName}`);
      totalCreated++;
    }
    console.log('');
  }

  console.log(`\n🎉 Successfully created ${totalCreated} test inquiries!`);
  console.log(`\n📊 Summary by status:`);
  
  const statusCounts = await prisma.inquiry.groupBy({
    by: ['status'],
    where: { ranchId: ranch.id },
    _count: true,
  });
  
  statusCounts.forEach((stat) => {
    console.log(`  - ${stat.status}: ${stat._count} inquiries`);
  });

  console.log(`\n🔗 View inquiries at: http://localhost:3000/dashboard/inquiries`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
