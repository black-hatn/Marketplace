const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = "nouradinezakariamahamat2@gmail.com";
  const adminPassword = "Fatmah23";

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPassword,
      name: "Nouradine Admin"
    },
    create: {
      email: adminEmail,
      password: adminPassword,
      name: "Nouradine Admin"
    }
  });

  console.log("Admin account restored:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
