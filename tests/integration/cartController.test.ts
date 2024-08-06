import request from "supertest";
import app from "../../backend/src/app"; // Adjust the path as necessary
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Cart Controller", () => {
  let testUserId: number;
  let testProductId: number;

  beforeAll(async () => {
    // Clear test database
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;

    // Create necessary test data
    const user = await prisma.user.create({
      data: {
        email: "testuser@example.com",
        password: "password123",
      },
    });

    testUserId = user.id;

    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "A product for testing purposes",
        msrpPrice: 20.0,
        currentPrice: 18.0,
        brand: "TestBrand",
        model: "TestModel",
      },
    });

    testProductId = product.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new cart", async () => {
    const response = await request(app)
      .post("/api/carts")
      .send({
        userId: testUserId,
        items: [
          {
            productId: testProductId,
            cartQuantity: 2,
            currentPrice: 18.0,
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.userId).toBe(testUserId);
  });

  it("should get all carts", async () => {
    const response = await request(app).get("/api/carts");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should update a cart", async () => {
    // Ensure there's only one cart per user
    await prisma.cart.deleteMany({
      where: { userId: testUserId },
    });

    const newCart = await prisma.cart.create({
      data: {
        userId: testUserId,
        items: {
          create: [
            {
              productId: testProductId,
              cartQuantity: 1,
              currentPrice: 18.0,
            },
          ],
        },
      },
      include: { items: true },
    });

    const response = await request(app)
      .put(`/api/carts/${newCart.id}`)
      .send({
        items: [
          {
            productId: testProductId,
            cartQuantity: 3,
            currentPrice: 18.0,
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.items[0].cartQuantity).toBe(3);
  });

  it("should delete a cart", async () => {
    // Ensure there's only one cart per user
    await prisma.cart.deleteMany({
      where: { userId: testUserId },
    });

    const newCart = await prisma.cart.create({
      data: {
        userId: testUserId,
        items: {
          create: [
            {
              productId: testProductId,
              cartQuantity: 1,
              currentPrice: 18.0,
            },
          ],
        },
      },
      include: { items: true },
    });

    const response = await request(app).delete(`/api/carts/${newCart.id}`);

    expect(response.status).toBe(204);
  });
});
