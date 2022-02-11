import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  const rowin = await prisma.user.create({
    data: {
      email: 'rowin@derow.nl',
      hash: '123456',
    },
  });

  console.log({ rowin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect;
  });
