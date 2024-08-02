const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Cart Model Tests", () => {
  let cartId;
  let userId;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        password: "password",
      },
    });
    userId = user.id;
  });

  test("should create a Cart", async () => {
    const cart = await prisma.cart.create({
      data: {
        userId: userId,
      },
    });
    expect(cart).toHaveProperty("id");
    cartId = cart.id;
  });

  test("should read a Cart", async () => {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    });
    expect(cart).toHaveProperty("id");
    expect(cart.userId).toBe(userId);
  });

  test("should update a Cart", async () => {
    const cart = await prisma.cart.update({
      where: { id: cartId },
      data: {
        updatedAt: new Date(),
      },
    });
    expect(cart).toHaveProperty("id");
    expect(cart.updatedAt).not.toBeNull();
  });

  test("should delete a Cart", async () => {
    const cart = await prisma.cart.delete({
      where: { id: cartId },
    });
    expect(cart).toHaveProperty("id");
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
