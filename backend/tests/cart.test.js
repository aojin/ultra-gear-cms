// backend/tests/cart.test.js
const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/prismaClient");

describe("Cart API Endpoints", () => {
  let cartId, userId;

  beforeAll(async () => {
    await prisma.cart.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.user.deleteMany({});

    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new cart", async () => {
    const res = await request(app).post("/api/carts").send({
      userId,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    cartId = res.body.id;
  });

  it("should fetch all carts", async () => {
    const res = await request(app).get("/api/carts");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update a cart", async () => {
    const res = await request(app).put(`/api/carts/${cartId}`).send({
      userId,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", cartId);
  });

  it("should delete a cart", async () => {
    const res = await request(app).delete(`/api/carts/${cartId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", cartId);
  });
});
