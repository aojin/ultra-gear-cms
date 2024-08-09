import request from "supertest";
import app from "../../backend/src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const uniqueSuffix = Date.now();

describe("CartItem Controller", () => {
  let testCartId: number;
  let testProductId: number;
  let testUserId: number;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: `testuser${uniqueSuffix}@example.com`,
        password: "password123",
        name: "Test User",
      },
    });
    testUserId = user.id;

    const product = await prisma.product.create({
      data: {
        name: `Test Product ${uniqueSuffix}`,
        description: "A product for testing purposes",
        msrpPrice: 29.99,
        currentPrice: 19.99,
        brand: "Test Brand",
        model: "Test Model",
      },
    });
    testProductId = product.id;

    const cart = await prisma.cart.create({
      data: {
        user: {
          connect: { id: testUserId },
        },
      },
    });
    testCartId = cart.id;
  });

  beforeEach(async () => {
    await prisma.cartItem.deleteMany({ where: { cartId: testCartId } });
    await prisma.cartItem.create({
      data: {
        cart: { connect: { id: testCartId } },
        product: { connect: { id: testProductId } },
        cartQuantity: 2,
        currentPrice: 19.99,
      },
    });
  });

  afterAll(async () => {
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it("should create a new cart item", async () => {
    const response = await request(app).post("/api/cart-items").send({
      cartId: testCartId,
      productId: testProductId,
      variantId: null,
      sizeId: null,
      cartQuantity: 1,
      currentPrice: 20.0,
    });

    expect(response.status).toBe(201);
    expect(response.body.cartId).toBe(testCartId);
  });

  it("should get all cart items", async () => {
    const response = await request(app).get("/api/cart-items");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should update a cart item", async () => {
    const cartItem = await prisma.cartItem.create({
      data: {
        cart: { connect: { id: testCartId } },
        product: { connect: { id: testProductId } },
        cartQuantity: 2,
        currentPrice: 19.99,
      },
    });

    const updateResponse = await request(app)
      .put(`/api/cart-items/${cartItem.id}`)
      .send({
        cartId: testCartId,
        productId: testProductId,
        cartQuantity: 3,
        currentPrice: 19.99,
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.cartQuantity).toBe(3);
  });

  it("should delete a cart item", async () => {
    const cartItem = await prisma.cartItem.create({
      data: {
        cart: { connect: { id: testCartId } },
        product: { connect: { id: testProductId } },
        cartQuantity: 2,
        currentPrice: 19.99,
      },
    });

    const deleteResponse = await request(app).delete(
      `/api/cart-items/${cartItem.id}`
    );

    expect(deleteResponse.status).toBe(204);
  });
});
