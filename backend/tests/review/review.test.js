const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Review Model Tests", () => {
  let reviewId;
  let userId;
  let productId;

  beforeAll(async () => {
    let user = await prisma.user.findFirst({
      where: { email: "testuser@example.com" },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "testuser@example.com",
          password: "password123",
        },
      });
    }

    userId = user.id;

    let product = await prisma.product.findFirst({
      where: { name: "Test Product" },
    });

    if (!product) {
      product = await prisma.product.create({
        data: {
          name: "Test Product",
          description: "Test Description",
          msrpPrice: 100.0,
          currentPrice: 90.0,
          brand: "Test Brand",
          model: "Test Model",
        },
      });
    }

    productId = product.id;

    let review = await prisma.review.findFirst({
      where: { rating: 4.5 },
    });

    if (!review) {
      review = await prisma.review.create({
        data: {
          rating: 4.5,
          userId: userId,
          productId: productId,
          comment: "Test Comment",
        },
      });
    }

    reviewId = review.id;
  });

  test("should create a Review", async () => {
    const newReview = await prisma.review.create({
      data: {
        rating: 5.0,
        userId: userId,
        productId: productId,
        comment: "New Review Comment",
      },
    });
    expect(newReview).toHaveProperty("id");
    await prisma.review.delete({ where: { id: newReview.id } }); // Clean up
  });

  test("should read a Review", async () => {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });
    expect(review).toHaveProperty("id");
  });

  test("should update a Review", async () => {
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { rating: 4.0 },
    });
    expect(review.rating).toBe(4.0);
  });

  test("should delete a Review", async () => {
    await prisma.review.delete({
      where: { id: reviewId },
    });
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });
    expect(review).toBeNull();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
