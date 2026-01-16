import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  console.log("🚀 Script iniziato..."); // LOG DI TEST

  // clean db
  await prisma.product.deleteMany();
  console.log("🗑️ Database svuotato");

  // generate fake products
  const fakeProducts = Array.from({ length: 50 }, () => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),    
    price: faker.commerce.price({ min: 10, max: 1000 }),
    discountPrice: faker.commerce.price({ min: 5, max: 500 }),
  }));

  // insert fake products
  await prisma.product.createMany({
    data: fakeProducts
  });
  
  console.log("✅ 50 prodotti inseriti con successo!");
}

main()
  .then(async () => {
    console.log("🏁 Operazione conclusa");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ ERRORE NEL SEED:", e);
    await prisma.$disconnect();
    process.exit(1);
  });