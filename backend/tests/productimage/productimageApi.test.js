const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const app = require("../../app");

const prisma = new PrismaClient();

describe("ProductImage API Tests", () => {
  let productImageId;
  let productId; // Assuming a product is required for creating a product image

  beforeAll(async () => {
    // Create a product for testing
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

    // Create a product image for testing
    const productImage = await prisma.productImage.create({
      data: {
        url: "http://example.com/image.jpg", // Required field based on schema
        productId: productId, // Required relation field based on schema
      },
    });
    productImageId = productImage.id;
  });

  afterAll(async () => {
    // Clean up specific entries
    if (productImageId) {
      await prisma.productImage.delete({ where: { id: productImageId } });
      productImageId = null; // Clear after successful deletion
    }
    if (productId) {
      await prisma.product.delete({ where: { id: productId } });
    }
    await prisma.$disconnect();
  });

  it("should get a single ProductImage", async () => {
    const res = await request(app).get(`/api/product-images/${productImageId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", productImageId);
    expect(res.body).toHaveProperty("url", "http://example.com/image.jpg");
  });

  it("should delete a ProductImage", async () => {
    const res = await request(app).delete(
      `/api/product-images/${productImageId}`
    );
    expect(res.statusCode).toEqual(204);

    // Verify deletion
    const deletedRes = await request(app).get(
      `/api/product-images/${productImageId}`
    );
    expect(deletedRes.statusCode).toEqual(404);

    // Clear productImageId after successful deletion
    productImageId = null;
  });
});
