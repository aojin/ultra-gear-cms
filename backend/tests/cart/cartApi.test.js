const request = require("supertest");
const app = require("../../app");
const prisma = require("../../prisma/prismaClient");

describe("Cart API Tests", () => {
  let userId, cartId, productId, variantId, sizeId;

  beforeAll(async () => {
    try {
      // Create a unique user
      const user = await prisma.user.create({
        data: {
          name: "Test User",
          email: `testuser-${Date.now()}@example.com`,
          password: "securepassword123",
        },
      });
      userId = user.id;

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

      // Create a size for testing
      const size = await prisma.size.create({
        data: {
          name: "Medium",
        },
      });
      sizeId = size.id;

      // Create a product variant for testing
      const variant = await prisma.productVariant.create({
        data: {
          name: "Test Variant",
          productId: productId,
          sizeId: sizeId,
        },
      });
      variantId = variant.id;
    } catch (error) {
      console.error("Error setting up test data:", error);
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should create a new cart", async () => {
    const res = await request(app).post("/api/carts").send({ userId });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.userId).toBe(userId);
    cartId = res.body.id;
  });

  test("should get the cart by id", async () => {
    const res = await request(app).get(`/api/carts/${cartId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", cartId);
    expect(res.body).toHaveProperty("userId", userId);
  });

  test("should update the cart", async () => {
    const res = await request(app)
      .put(`/api/carts/${cartId}`)
      .send({ items: [{ productId, variantId, quantity: 2 }] });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", cartId);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0]).toHaveProperty("productId", productId);
    expect(res.body.items[0]).toHaveProperty("variantId", variantId);
  });

  test("should delete the cart", async () => {
    const res = await request(app).delete(`/api/carts/${cartId}`);
    expect(res.statusCode).toEqual(204); // Expecting 204 for successful deletion

    // Verify cart is deleted
    const checkRes = await request(app).get(`/api/carts/${cartId}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
