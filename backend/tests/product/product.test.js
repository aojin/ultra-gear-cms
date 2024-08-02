const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Product Model Tests", () => {
  let productId;

  test("should create a Product", async () => {
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
    expect(product).toHaveProperty("id");
    productId = product.id;
  });

  test("should read a Product", async () => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    expect(product).toHaveProperty("id");
    expect(product.name).toBe("Test Product");
  });

  test("should update a Product", async () => {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        currentPrice: 80.0,
      },
    });
    expect(product).toHaveProperty("id");
    expect(product.currentPrice).toBe(80.0);
  });

  test("should delete a Product", async () => {
    const product = await prisma.product.delete({
      where: { id: productId },
    });
    expect(product).toHaveProperty("id");
  });
});
