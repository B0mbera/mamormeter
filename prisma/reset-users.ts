import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Drinks first (FK), then Users. DrinkPresets are left intact.
  const drinks = await prisma.drink.deleteMany();
  const users = await prisma.user.deleteMany();
  console.log(`Deleted ${drinks.count} drinks and ${users.count} users. DrinkPresets untouched.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
