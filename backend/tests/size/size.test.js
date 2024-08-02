const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Size Model Tests", () => {
  let sizeId;
  let productId;
  let variantId;

  beforeAll(async () => {
    // Ensure a product and variant exist
    let product = await prisma.product.findFirst();
    if (!product) {
      product = await prisma.product.create({
        data: {
          name: "Test Product",
          description: "A product for testing",
          msrpPrice: 100.0,
          currentPrice: 90.0,
          brand: "Test Brand",
          model: "Test Model",
        },
      });
    }
    productId = product.id;

    let variant = await prisma.productVariant.findFirst({
      where: { productId: productId },
    });
    if (!variant) {
      variant = await prisma.productVariant.create({
        data: {
          name: "Test Variant",
          msrpPrice: 100.0,
          currentPrice: 90.0,
          productId: productId,
        },
      });
    }
    variantId = variant.id;

    let size = await prisma.size.findFirst({
      where: { size: "M" },
    });
    if (!size) {
      size = await prisma.size.create({
        data: {
          size: "M",
          quantity: 10,
          productId: productId,
          variantId: variantId,
        },
      });
    }
    sizeId = size.id;
    productId = size.productId;
    variantId = size.variantId;
  });

  test("should create a Size", async () => {
    const newSize = await prisma.size.create({
      data: {
        size: "L",
        quantity: 20,
        productId: productId,
        variantId: variantId,
      },
    });
    expect(newSize).toHaveProperty("id");
    await prisma.size.delete({ where: { id: newSize.id } }); // Clean up
  });

  test("should read a Size", async () => {
    const size = await prisma.size.findUnique({
      where: { id: sizeId },
    });
    expect(size).toHaveProperty("id");
  });

  test("should update a Size", async () => {
    const size = await prisma.size.update({
      where: { id: sizeId },
      data: { quantity: 15 },
    });
    expect(size.quantity).toBe(15);
  });

  test("should delete a Size", async () => {
    await prisma.size.delete({
      where: { id: sizeId },
    });
    const size = await prisma.size.findUnique({
      where: { id: sizeId },
    });
    expect(size).toBeNull();
  });
});
