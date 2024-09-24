const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const password = await hash("testPassword", 12);
  const user = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      firstName: "testFirstName",
      lastName: "testLastName",
      username: "testUser",
      email: "test@test.com",
      password,
      posts: {
        create: {
          title: "watch",
          link: "https://seikousa.com/collections/essentials/products/swr083",
          image: "watch.webp",
          description: "seiko watch i want",
        },
      },
    },
  });
  console.log({ user });
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
