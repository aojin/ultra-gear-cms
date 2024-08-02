const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const app = require("../../app");

const prisma = new PrismaClient();

describe("Review API Tests", () => {
  let reviewId;
  let userId;
  let productId;

  beforeAll(async () => {
    // Create a user for testing
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: `testuser-${Date.now()}@example.com`,
        password: "password123",
      },
    });
    userId = user.id;

    // Create a product for testing
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        msrpPrice: 100.0,
        currentPrice: 90.0,
        brand: "Test Brand",
        model: "Test Model",
      },
    });
    productId = product.id;

    // Create a review for testing
    const review = await prisma.review.create({
      data: {
        rating: 5, // Ensure rating is a valid number
        comment: "This is a test review",
        userId: userId,
        productId: productId,
      },
    });
    reviewId = review.id;
  });

  afterAll(async () => {
    // Clean up specific entries
    if (reviewId) await prisma.review.delete({ where: { id: reviewId } });
    if (productId) await prisma.product.delete({ where: { id: productId } });
    if (userId) await prisma.user.delete({ where: { id: userId } });

    await prisma.$disconnect();
  });

  it("should create a new review", async () => {
    const newReview = {
      rating: 4,
      comment: "Another test review",
      userId: userId,
      productId: productId,
    };

    const res = await request(app).post("/api/reviews").send(newReview);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.rating).toEqual(newReview.rating);
    expect(res.body.comment).toEqual(newReview.comment);
  });

  it("should retrieve a review by ID", async () => {
    const res = await request(app).get(`/api/reviews/${reviewId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toEqual(reviewId);
    expect(res.body.rating).toEqual(5); // Check initial rating
    expect(res.body.comment).toEqual("This is a test review");
  });

  it("should update a review", async () => {
    const updatedReview = {
      rating: 3,
      comment: "Updated test review",
    };

    const res = await request(app)
      .put(`/api/reviews/${reviewId}`)
      .send(updatedReview);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toEqual(reviewId);
    expect(res.body.rating).toEqual(updatedReview.rating);
    expect(res.body.comment).toEqual(updatedReview.comment);
  });

  it("should delete a review", async () => {
    const res = await request(app).delete(`/api/reviews/${reviewId}`);

    expect(res.statusCode).toEqual(204); // No content on successful delete
  });

  it("should retrieve all reviews", async () => {
    const res = await request(app).get("/api/reviews");

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
