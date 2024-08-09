import request from "supertest";
import app from "../../backend/src/app"; // Adjust the path as necessary
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Cart Controller", () => {
  beforeAll(async () => {
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new cart", async () => {
    const testUser = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        name: "Test User",
        password: "password",
      },
    });

    const testProduct = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        brand: "Test Brand",
        model: "Test Model",
        msrpPrice: 100.0,
        isSingleSize: true,
        inventory: {
          create: {
            quantity: 10,
          },
        },
      },
      include: {
        inventory: true,
      },
    });

    const response = await request(app)
      .post("/api/carts")
      .send({
        userId: testUser.id,
        items: [
          {
            productId: testProduct.id,
            cartQuantity: 2,
            currentPrice: 100,
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.userId).toBe(testUser.id);
  });

  it("should get all carts", async () => {
    const testUser = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        name: "Test User",
        password: "password",
      },
    });

    const testProduct = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        brand: "Test Brand",
        model: "Test Model",
        msrpPrice: 100.0,
        isSingleSize: true,
        inventory: {
          create: {
            quantity: 10,
          },
        },
      },
      include: {
        inventory: true,
      },
    });

    await prisma.cart.create({
      data: {
        userId: testUser.id,
        items: {
          create: {
            productId: testProduct.id,
            cartQuantity: 2,
            currentPrice: 100,
          },
        },
      },
      include: {
        items: true,
      },
    });

    const response = await request(app).get("/api/carts");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should delete a cart", async () => {
    const testUser = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        name: "Test User",
        password: "password",
      },
    });

    const testProduct = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        brand: "Test Brand",
        model: "Test Model",
        msrpPrice: 100.0,
        isSingleSize: true,
        inventory: {
          create: {
            quantity: 10,
          },
        },
      },
      include: {
        inventory: true,
      },
    });

    const newCart = await prisma.cart.create({
      data: {
        userId: testUser.id,
        items: {
          create: {
            productId: testProduct.id,
            cartQuantity: 2,
            currentPrice: 100,
          },
        },
      },
      include: {
        items: true,
      },
    });

    const response = await request(app).delete(`/api/carts/${newCart.id}`);

    expect(response.status).toBe(204);

    const deletedCart = await prisma.cart.findUnique({
      where: { id: newCart.id },
    });
    expect(deletedCart).toBeNull();
  });

  // New test cases
  it("should add an item to the cart", async () => {
    const testUser = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        name: "Test User",
        password: "password",
      },
    });

    const testProduct = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        brand: "Test Brand",
        model: "Test Model",
        msrpPrice: 100.0,
        isSingleSize: true,
        inventory: {
          create: {
            quantity: 10,
          },
        },
      },
      include: {
        inventory: true,
      },
    });

    const newCart = await prisma.cart.create({
      data: {
        userId: testUser.id,
      },
    });

    const response = await request(app)
      .post("/api/carts/add-item")
      .send({
        cartId: newCart.id,
        item: {
          productId: testProduct.id,
          cartQuantity: 1,
          currentPrice: 100,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.items.length).toBe(1);
    expect(response.body.items[0].cartQuantity).toBe(1);
  });

  it("should remove an item from the cart", async () => {
    const testUser = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        name: "Test User",
        password: "password",
      },
    });

    const testProduct = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        brand: "Test Brand",
        model: "Test Model",
        msrpPrice: 100.0,
        isSingleSize: true,
        inventory: {
          create: {
            quantity: 10,
          },
        },
      },
      include: {
        inventory: true,
      },
    });

    const newCart = await prisma.cart.create({
      data: {
        userId: testUser.id,
        items: {
          create: {
            productId: testProduct.id,
            cartQuantity: 2,
            currentPrice: 100,
          },
        },
      },
      include: {
        items: true,
      },
    });

    const response = await request(app).post("/api/carts/remove-item").send({
      cartId: newCart.id,
      itemId: newCart.items[0].id,
    });

    expect(response.status).toBe(200);
    expect(response.body.items.length).toBe(0);
  });

  it("should clear the cart", async () => {
    const testUser = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        name: "Test User",
        password: "password",
      },
    });

    const testProduct = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        brand: "Test Brand",
        model: "Test Model",
        msrpPrice: 100.0,
        isSingleSize: true,
        inventory: {
          create: {
            quantity: 10,
          },
        },
      },
      include: {
        inventory: true,
      },
    });

    const newCart = await prisma.cart.create({
      data: {
        userId: testUser.id,
        items: {
          create: {
            productId: testProduct.id,
            cartQuantity: 2,
            currentPrice: 100,
          },
        },
      },
      include: {
        items: true,
      },
    });

    const response = await request(app).post("/api/carts/clear").send({
      userId: testUser.id,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Cart cleared successfully");

    const clearedCart = await prisma.cart.findUnique({
      where: { id: newCart.id },
      include: { items: true },
    });

    expect(clearedCart?.items.length).toBe(0);
  });
});
