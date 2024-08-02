const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("CartItem Model Tests", () => {
  let cartItemId;
  let userId;
  let productId;
  let cartId;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        password: "password",
      },
    });
    userId = user.id;

    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        msrpPrice: 100.0,
        currentPrice: 90.0,
        brand: "Test Brand",
        model: "Test Model",
      },
    });
    productId = product.id;

    const cart = await prisma.cart.create({
      data: {
        userId: userId,
      },
    });
    cartId = cart.id;
  });

  test("should create a CartItem", async () => {
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cartId,
        productId: productId,
        cartQuantity: 1,
        currentPrice: 90.0,
      },
    });
    expect(cartItem).toHaveProperty("id");
    cartItemId = cartItem.id;
  });

  test("should read a CartItem", async () => {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });
    expect(cartItem).toHaveProperty("id");
    expect(cartItem.cartId).toBe(cartId);
  });

  test("should update a CartItem", async () => {
    const cartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        cartQuantity: 2,
      },
    });
    expect(cartItem).toHaveProperty("id");
    expect(cartItem.cartQuantity).toBe(2);
  });

  test("should delete a CartItem", async () => {
    const cartItem = await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    expect(cartItem).toHaveProperty("id");
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
