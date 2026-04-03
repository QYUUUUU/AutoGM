const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gods.fr';
  const password = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password,
      role: 'admin',
      id: 1, // Controller requires: req.session.userId == 1
      enabled: true
    },
    create: {
      id: 1, // Controller requires: req.session.userId == 1
      email,
      password,
      role: 'admin',
      pseudo: 'SuperMJ',
      enabled: true
    },
  });

  console.log('Admin account created/updated:', admin);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
