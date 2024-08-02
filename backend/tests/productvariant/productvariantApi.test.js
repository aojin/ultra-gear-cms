const { PrismaClient } = require("@prisma/client");
const request = require("supertest");
const app = require("../../app");

const prisma = new PrismaClient();

let productId;
let productVariantId;

beforeAll(async () => {
  await prisma.$connect();

  // Create a product to get the productId
  const product = await prisma.product.create({
    data: {
      name: "Test Product",
      description: "Test Product Description",
      msrpPrice: 100.0,
      currentPrice: 90.0,
      brand: "Test Brand",
      model: "Test Model",
    },
  });
  productId = product.id;
});

afterAll(async () => {
  // Clean up specific entries if they still exist
  if (productVariantId) {
    const productVariantExists = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
    });
    if (productVariantExists) {
      try {
        await prisma.productVariant.delete({ where: { id: productVariantId } });
      } catch (error) {
        console.error("Error deleting product variant during teardown:", error);
      }
    }
  }
  if (productId) {
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (productExists) {
      try {
        await prisma.product.delete({ where: { id: productId } });
      } catch (error) {
        console.error("Error deleting product during teardown:", error);
      }
    }
  }
  await prisma.$disconnect();
});

describe("ProductVariant API Tests", () => {
  test("should create a new ProductVariant", async () => {
    const res = await request(app).post("/api/product-variants").send({
      name: "New Test ProductVariant",
      msrpPrice: 120.0,
      currentPrice: 100.0,
      productId: productId,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    productVariantId = res.body.id;
  });

  test("should fetch all product variants", async () => {
    const res = await request(app).get("/api/product-variants");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("should update a ProductVariant", async () => {
    const res = await request(app)
      .put(`/api/product-variants/${productVariantId}`)
      .send({
        name: "Updated ProductVariant",
        msrpPrice: 150.0,
        currentPrice: 120.0,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Updated ProductVariant");
  });

  test("should delete a ProductVariant", async () => {
    const res = await request(app).delete(
      `/api/product-variants/${productVariantId}`
    );
    expect(res.statusCode).toEqual(204);
  });
});
