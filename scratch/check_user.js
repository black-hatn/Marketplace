const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const email = 'salimossoufatime@gmail.com';
  const brand = await prisma.brand.findFirst({ where: { email } });
  const client = await prisma.client.findFirst({ where: { email } });
  
  console.log('--- DB CHECK ---');
  console.log('Brand found:', brand ? 'YES' : 'NO');
  if (brand) console.log('Brand Details:', brand);
  
  console.log('Client found:', client ? 'YES' : 'NO');
  if (client) console.log('Client Details:', client);
  
  await prisma.$disconnect();
}

check();
