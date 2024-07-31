const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/prismaClient");

describe("Order Item API Endpoints", () => {
  let productId, userId, orderId, orderItemId;

  beforeAll(async () => {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        price: 100.0,
        imageUrl: "http://example.com/image.png",
      },
    });
    productId = product.id;

    const user = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        password: "password123",
        name: "Test User",
      },
    });
    userId = user.id;

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: 100.0,
      },
    });
    orderId = order.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new order item", async () => {
    const res = await request(app).post("/api/order-items").send({
      orderId,
      productId,
      quantity: 2,
      price: 100.0,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    orderItemId = res.body.id;
  });

  it("should fetch all order items", async () => {
    const res = await request(app).get("/api/order-items");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should update an order item", async () => {
    const res = await request(app).put(`/api/order-items/${orderItemId}`).send({
      quantity: 3,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.quantity).toEqual(3);
  });

  it("should delete an order item", async () => {
    const res = await request(app).delete(`/api/order-items/${orderItemId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", orderItemId);
  });
});
