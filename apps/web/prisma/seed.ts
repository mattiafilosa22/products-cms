import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  console.log("Script iniziato...");

  // clean db
  await prisma.product.deleteMany();
  console.log("Database svuotato");

  // generate fake products
  const fakeProducts = Array.from({ length: 50 }, () => {
    const price = parseFloat(faker.commerce.price({ min: 20, max: 1000 }));
    const hasDiscount = Math.random() > 0.5;
    const discountPrice = hasDiscount
      ? parseFloat(faker.commerce.price({ min: 5, max: price - 1 }))
      : null;

    return {
      name: faker.commerce.productName().substring(0, 20),
      description: faker.commerce.productDescription().substring(0, 200),
      price,
      discountPrice,
    };
  });

  // insert fake products
  await prisma.product.createMany({
    data: fakeProducts,
  });

  console.log("✅ 50 prodotti inseriti con successo!");
};

main()
  .then(async () => {
    console.log("Operazione conclusa");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("ERRORE NEL SEED:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
