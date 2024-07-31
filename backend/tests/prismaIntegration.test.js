const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Prisma Integration Test", () => {
  let productId;

  beforeAll(async () => {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new product", async () => {
    const newProduct = await prisma.product.create({
      data: {
        name: "New Product",
        description: "A description of the new product",
        price: 29.99,
        imageUrl: "http://example.com/image.png",
      },
    });
    expect(newProduct).toHaveProperty("id");
    expect(newProduct.name).toBe("New Product");
    productId = newProduct.id;
  });

  it("should fetch all products", async () => {
    const products = await prisma.product.findMany();
    expect(products).toBeInstanceOf(Array);
  });

  it("should update a product", async () => {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { price: 24.99 },
    });
    expect(updatedProduct.price).toBe(24.99);
  });

  it("should delete a product", async () => {
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });
    expect(deletedProduct).toHaveProperty("id", productId);
  });
});
