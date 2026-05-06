const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function convert() {
  const email = 'salimossoufatime@gmail.com';
  
  // 1. Find the client
  const client = await prisma.client.findUnique({ where: { email } });
  
  if (!client) {
    console.log('Client not found');
    return;
  }

  const name = `${client.prenom} ${client.nom}`;
  const slug = name.toLowerCase().replace(/ /g, '-');

  // 2. Check if brand already exists
  const existingBrand = await prisma.brand.findUnique({ where: { email } });
  if (existingBrand) {
    console.log('Brand already exists');
    return;
  }

  // 3. Create the brand
  const brand = await prisma.brand.create({
    data: {
      name: name,
      slug: slug,
      email: email,
      password: client.mot_de_passe_hash, // Reuse the same hash
      title: name,
      tagline: 'Ma boutique sur Immersive',
      description: 'Bienvenue sur ma boutique officielle.',
      story: 'Une passion pour l\'excellence.',
      values: 'Qualité, Authenticité, Service',
      impact: 'Contribution locale',
      image: '/placeholder.png',
      phone: client.telephone,
      isVerified: true
    }
  });

  console.log('--- CONVERSION SUCCESS ---');
  console.log('Created Brand ID:', brand.id);
  
  // Optional: change client role to VENDOR just in case, though auth checks Brand first
  await prisma.client.update({
    where: { email },
    data: { role: 'ADMIN' } // Let's give them Admin or just keep Client, but they will be picked as VENDOR by Brand check
  });

  await prisma.$disconnect();
}

convert();
