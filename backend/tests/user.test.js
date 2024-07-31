const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/prismaClient");

describe("User API Endpoints", () => {
  let userId;

  beforeAll(async () => {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        email: `test${Date.now()}@example.com`,
        password: "password123",
        name: "Test User",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    userId = res.body.id;
  });

  it("should fetch all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should update a user", async () => {
    const res = await request(app).put(`/api/users/${userId}`).send({
      name: "Updated User",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Updated User");
  });

  it("should delete a user", async () => {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", userId);
  });
});
