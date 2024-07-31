const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/prismaClient");

describe("Cart Item API Endpoints", () => {
  let productId, userId, cartId, cartItemId;

  beforeAll(async () => {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
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

    const cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
    cartId = cart.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new cart item", async () => {
    const res = await request(app).post("/api/cart-items").send({
      cartId,
      productId,
      quantity: 2,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    cartItemId = res.body.id;
  });

  it("should fetch all cart items", async () => {
    const res = await request(app).get("/api/cart-items");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should update a cart item", async () => {
    const res = await request(app).put(`/api/cart-items/${cartItemId}`).send({
      quantity: 3,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.quantity).toEqual(3);
  });

  it("should delete a cart item", async () => {
    const res = await request(app).delete(`/api/cart-items/${cartItemId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", cartItemId);
  });
});
