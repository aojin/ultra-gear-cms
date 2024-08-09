import request from "supertest";
import app from "../../backend/src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Reviews Controller", () => {
  let productId: number;
  let reviewId: number;
  let userId: number;

  beforeAll(async () => {
    // Clean up test database
    await prisma.review.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    // Create test product and user
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        msrpPrice: 100,
        currentPrice: 90,
        brand: "Test Brand",
        model: "Test Model",
        quantity: 10,
      },
    });

    productId = product.id;

    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: "securepassword123",
      },
    });

    userId = user.id;

    // Create a test review
    const review = await prisma.review.create({
      data: {
        userName: "Test User",
        userEmail: "test@example.com",
        userId,
        productId,
        rating: 4.5,
        comment: "Great product!",
      },
    });

    reviewId = review.id;
  });

  afterEach(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });

  afterAll(async () => {
    // Clean up test database
    await prisma.review.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it("should create a new review", async () => {
    const response = await request(app).post("/api/reviews").send({
      userName: "Test User",
      userEmail: "test@example.com",
      userId,
      productId,
      rating: 4.5,
      comment: "Great product!",
    });

    expect(response.status).toBe(201);
    expect(response.body.userName).toBe("Test User");
    reviewId = response.body.id;
  });

  it("should get all reviews", async () => {
    const response = await request(app).get("/api/reviews");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a review by ID", async () => {
    const response = await request(app).get(`/api/reviews/${reviewId}`);

    expect(response.status).toBe(200);
    expect(response.body.userName).toBe("Test User");
  });

  it("should get reviews by user ID", async () => {
    const response = await request(app).get(`/api/reviews/user/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get reviews by product ID", async () => {
    const response = await request(app).get(
      `/api/reviews/product/${productId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should update a review", async () => {
    const response = await request(app).put(`/api/reviews/${reviewId}`).send({
      userName: "Updated User",
      userEmail: "updated@example.com",
      userId,
      productId,
      rating: 5,
      comment: "Updated comment",
    });

    expect(response.status).toBe(200);
    expect(response.body.userName).toBe("Updated User");
  });

  it("should archive a review by user", async () => {
    const response = await request(app)
      .put(`/api/reviews/archive/${reviewId}`)
      .send({ userId });

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(true);
  });

  it("should archive a review by admin", async () => {
    const response = await request(app)
      .put(`/api/reviews/archive/admin/${reviewId}`)
      .send({ isAdmin: true });

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(true);
  });

  it("should unarchive a review by admin", async () => {
    const response = await request(app)
      .put(`/api/reviews/unarchive/admin/${reviewId}`)
      .send({ isAdmin: true });

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(false);
  });

  it("should delete a review", async () => {
    const response = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .send({ isAdmin: true });

    expect(response.status).toBe(204);
  });

  it("should return 404 for non-existent review by ID", async () => {
    const response = await request(app).get("/api/reviews/999999");

    expect(response.status).toBe(404);
  });

  it("should return 404 when updating a non-existent review", async () => {
    const response = await request(app).put("/api/reviews/999999").send({
      userName: "NonExistent",
      userEmail: "nonexistent@example.com",
      userId,
      productId,
      rating: 3,
      comment: "Non-existent review",
    });

    expect(response.status).toBe(404);
  });

  it("should return 404 when archiving a non-existent review by user", async () => {
    const response = await request(app)
      .put("/api/reviews/archive/999999")
      .send({ userId });

    expect(response.status).toBe(404);
  });

  it("should return 404 when archiving a non-existent review by admin", async () => {
    const response = await request(app)
      .put("/api/reviews/archive/admin/999999")
      .send({ isAdmin: true });

    expect(response.status).toBe(404);
  });

  it("should return 404 when unarchiving a non-existent review by admin", async () => {
    const response = await request(app)
      .put("/api/reviews/unarchive/admin/999999")
      .send({ isAdmin: true });

    expect(response.status).toBe(404);
  });

  it("should return 404 when deleting a non-existent review", async () => {
    const response = await request(app).delete("/api/reviews/999999").send({
      isAdmin: true,
    });

    expect(response.status).toBe(404);
  });
});
