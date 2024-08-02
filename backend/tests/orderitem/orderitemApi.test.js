const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const app = require("../../app");

const prisma = new PrismaClient();

describe("OrderItem API Tests", () => {
  let userId, orderId, productId, variantId, sizeId, orderitemId;

  beforeAll(async () => {
    // Create a user for testing
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      },
    });
    userId = user.id;

    // Create an order for the user
    const order = await prisma.order.create({
      data: { userId: userId, totalAmount: 100 },
    });
    orderId = order.id;

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

    // Create a size for testing
    const size = await prisma.size.create({
      data: { size: "M", quantity: 100, productId: productId },
    });
    sizeId = size.id;
  });

  afterAll(async () => {
    // Cleanup specific instances created in this test suite
    if (orderitemId) {
      await prisma.orderItem.delete({ where: { id: orderitemId } });
    }
    if (orderId) {
      await prisma.order.delete({ where: { id: orderId } });
    }
    if (sizeId) {
      await prisma.size.delete({ where: { id: sizeId } });
    }
    if (variantId) {
      await prisma.productVariant.update({
        where: { id: variantId },
        data: { archived: true },
      });
    }
    if (productId) {
      await prisma.product.update({
        where: { id: productId },
        data: { archived: true },
      });
    }
    if (userId) {
      await prisma.user.delete({ where: { id: userId } });
    }
    await prisma.$disconnect();
  });

  it("should create a new OrderItem", async () => {
    const res = await request(app).post("/api/order-items").send({
      orderId: orderId,
      productId: productId,
      variantId: variantId,
      quantity: 1,
      price: 90.0,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    orderitemId = res.body.id;
  });

  it("should fetch all order items", async () => {
    const res = await request(app).get("/api/order-items");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should get a single OrderItem", async () => {
    const res = await request(app).get(`/api/order-items/${orderitemId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", orderitemId);
  });

  it("should update an OrderItem", async () => {
    const res = await request(app).put(`/api/order-items/${orderitemId}`).send({
      quantity: 2,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.quantity).toBe(2);
  });

  it("should delete an OrderItem", async () => {
    const res = await request(app).delete(`/api/order-items/${orderitemId}`);
    expect(res.statusCode).toEqual(204);

    // Verify deletion
    const deletedRes = await request(app).get(
      `/api/order-items/${orderitemId}`
    );
    expect(deletedRes.statusCode).toEqual(404);
  });
});
