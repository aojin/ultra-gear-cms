const request = require("supertest");
const app = require("../../app"); // Ensure this points to your Express app
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // Ensure this line is present

let sizeId1, sizeId2, productId, variantId;

beforeAll(async () => {
  await prisma.$connect();

  // Create a product for testing
  const product = await prisma.product.create({
    data: {
      name: "Test Product",
      description: "Test Product Description",
      msrpPrice: 100.0,
      currentPrice: 80.0,
      brand: "Test Brand",
      model: "Test Model",
    },
  });
  productId = product.id;

  // Create a product variant for testing
  const variant = await prisma.productVariant.create({
    data: {
      name: "Test Variant",
      msrpPrice: 100.0,
      currentPrice: 80.0,
      productId: productId,
    },
  });
  variantId = variant.id;

  // Create sizes for testing
  const size1 = await prisma.size.create({
    data: {
      size: "Test Size 1",
      quantity: 10,
      productId: productId,
      variantId: variantId,
    },
  });
  sizeId1 = size1.id;

  const size2 = await prisma.size.create({
    data: {
      size: "Test Size 2",
      quantity: 15,
      productId: productId,
      variantId: variantId,
    },
  });
  sizeId2 = size2.id;
});

afterAll(async () => {
  try {
    // Cleanup
    if (variantId) {
      await prisma.productVariant.delete({ where: { id: variantId } });
    }
    if (productId) {
      await prisma.product.delete({ where: { id: productId } });
    }
    await prisma.$disconnect();
  } catch (error) {
    console.error("Error during teardown:", error);
  }
});

describe("Size API Tests", () => {
  it("should create a new Size", async () => {
    const res = await request(app).post("/api/sizes").send({
      size: "Large",
      quantity: 5,
      productId: productId,
      variantId: variantId,
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.size).toEqual("Large");
    expect(res.body.quantity).toEqual(5);
  });

  it("should update a Size", async () => {
    const res = await request(app).put(`/api/sizes/${sizeId1}`).send({
      size: "Medium",
      quantity: 20,
      productId: productId,
      variantId: variantId,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.size).toEqual("Medium");
    expect(res.body.quantity).toEqual(20);
  });

  it("should get all Sizes", async () => {
    const res = await request(app).get("/api/sizes");

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should delete a Size", async () => {
    const res = await request(app).delete(`/api/sizes/${sizeId1}`);
    console.log("Delete Size Response:", res.body); // Add logging
    console.log("Delete Size Status Code:", res.statusCode); // Add logging

    expect(res.statusCode).toEqual(204); // Expect 204 No Content for successful deletion

    // Verify deletion
    const deletedRes = await request(app).get(`/api/sizes/${sizeId1}`);
    expect(deletedRes.statusCode).toBe(404);
  });
});
