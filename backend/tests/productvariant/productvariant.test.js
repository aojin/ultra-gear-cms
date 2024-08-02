const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("ProductVariant Model Tests", () => {
  let variantId;
  let productId;

  beforeAll(async () => {
    let product = await prisma.product.findFirst({
      where: { name: "Test Product" },
    });

    if (!product) {
      product = await prisma.product.create({
        data: {
          name: "Test Product",
          description: "Test Product Description",
          msrpPrice: 100.0,
          currentPrice: 90.0,
          brand: "Test Brand",
          model: "Test Model",
        },
      });
    }

    productId = product.id;

    let variant = await prisma.productVariant.findFirst({
      where: { name: "Test Variant" },
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
  });

  test("should create a ProductVariant", async () => {
    const newVariant = await prisma.productVariant.create({
      data: {
        name: "New Test Variant",
        msrpPrice: 100.0,
        currentPrice: 90.0,
        productId: productId, // Using existing product's productId
      },
    });
    expect(newVariant).toHaveProperty("id");
    await prisma.productVariant.delete({ where: { id: newVariant.id } }); // Clean up
  });

  test("should read a ProductVariant", async () => {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    expect(variant).toHaveProperty("id");
  });

  test("should update a ProductVariant", async () => {
    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { name: "Updated Variant" },
    });
    expect(variant.name).toBe("Updated Variant");
  });

  test("should delete a ProductVariant", async () => {
    await prisma.productVariant.delete({
      where: { id: variantId },
    });
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    expect(variant).toBeNull();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
