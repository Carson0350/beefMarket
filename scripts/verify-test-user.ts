import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: 'testranch@example.com' },
    data: { emailVerified: new Date() },
  });
  console.log('Email verified for user:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
