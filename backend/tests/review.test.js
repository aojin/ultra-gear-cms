const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/prismaClient");

describe("Review API Endpoints", () => {
  let reviewId, productId, userId;

  beforeAll(async () => {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.review.deleteMany({});
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new review", async () => {
    const res = await request(app).post("/api/reviews").send({
      userId,
      productId,
      rating: 5,
      comment: "Great product!",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    reviewId = res.body.id;
  });

  it("should fetch all reviews", async () => {
    const res = await request(app).get("/api/reviews");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should update a review", async () => {
    const res = await request(app).put(`/api/reviews/${reviewId}`).send({
      rating: 4,
      comment: "Good product.",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.rating).toEqual(4);
    expect(res.body.comment).toEqual("Good product.");
  });

  it("should delete a review", async () => {
    const res = await request(app).delete(`/api/reviews/${reviewId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", reviewId);
  });
});
