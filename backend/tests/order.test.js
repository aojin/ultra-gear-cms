const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/prismaClient");

describe("Order API Endpoints", () => {
  let userId, orderId;

  beforeAll(async () => {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    const user = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        password: "password123",
        name: "Test User",
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new order", async () => {
    const res = await request(app).post("/api/orders").send({
      userId,
      totalAmount: 100.0,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    orderId = res.body.id;
  });

  it("should fetch all orders", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should update an order", async () => {
    const res = await request(app).put(`/api/orders/${orderId}`).send({
      totalAmount: 150.0,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.totalAmount).toEqual(150.0);
  });

  it("should delete an order", async () => {
    const res = await request(app).delete(`/api/orders/${orderId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", orderId);
  });
});
