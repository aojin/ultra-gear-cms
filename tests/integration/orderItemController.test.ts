import request from "supertest";
import app from "../../backend/src/app"; // Adjust the path as necessary
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("OrderItem Controller", () => {
  beforeAll(async () => {
    // Clean up the database before running tests
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.size.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new order item", async () => {
    const user = await prisma.user.create({
      data: {
        email: "testuser@example.com",
        password: "password",
        name: "Test User",
        address1: "123 Test St",
        address2: "Apt 4",
        phoneNumber: "123-456-7890",
      },
    });

    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "A test product",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "TestBrand",
        model: "TB123",
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: 100.0,
      },
    });

    const response = await request(app).post("/api/order-items").send({
      orderId: order.id,
      productId: product.id,
      quantity: 2,
      price: 50.0,
      productName: "Test Product",
    });

    expect(response.status).toBe(201);
    expect(response.body.productName).toBe("Test Product");
    expect(response.body.quantity).toBe(2);

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should get all order items", async () => {
    const user = await prisma.user.create({
      data: {
        email: "testuser2@example.com",
        password: "password",
        name: "Test User 2",
        address1: "124 Test St",
        address2: "Apt 5",
        phoneNumber: "123-456-7891",
      },
    });

    const product = await prisma.product.create({
      data: {
        name: "Test Product 2",
        description: "Another test product",
        msrpPrice: 200,
        currentPrice: 160,
        brand: "TestBrand",
        model: "TB456",
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: 200.0,
      },
    });

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        productName: "Test Product 2",
        quantity: 3,
        price: 70.0,
      },
    });

    const response = await request(app).get("/api/order-items");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should get order item by ID", async () => {
    const user = await prisma.user.create({
      data: {
        email: "testuser3@example.com",
        password: "password",
        name: "Test User 3",
        address1: "125 Test St",
        address2: "Apt 6",
        phoneNumber: "123-456-7892",
      },
    });

    const product = await prisma.product.create({
      data: {
        name: "Test Product 3",
        description: "Yet another test product",
        msrpPrice: 300,
        currentPrice: 240,
        brand: "TestBrand",
        model: "TB789",
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: 300.0,
      },
    });

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        productName: "Test Product 3",
        quantity: 4,
        price: 80.0,
      },
    });

    const response = await request(app).get(`/api/order-items/${orderItem.id}`);

    expect(response.status).toBe(200);
    expect(response.body.productName).toBe("Test Product 3");

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should update an order item", async () => {
    const user = await prisma.user.create({
      data: {
        email: "testuser4@example.com",
        password: "password",
        name: "Test User 4",
        address1: "126 Test St",
        address2: "Apt 7",
        phoneNumber: "123-456-7893",
      },
    });

    const product = await prisma.product.create({
      data: {
        name: "Test Product 4",
        description: "A fourth test product",
        msrpPrice: 400,
        currentPrice: 320,
        brand: "TestBrand",
        model: "TB101",
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: 400.0,
      },
    });

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        productName: "Test Product 4",
        quantity: 5,
        price: 90.0,
      },
    });

    const response = await request(app)
      .put(`/api/order-items/${orderItem.id}`)
      .send({
        quantity: 6,
        price: 100.0,
      });

    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(6);
    expect(response.body.price).toBe(100.0);

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should archive an order item", async () => {
    const user = await prisma.user.create({
      data: {
        email: "testuser5@example.com",
        password: "password",
        name: "Test User 5",
        address1: "127 Test St",
        address2: "Apt 8",
        phoneNumber: "123-456-7894",
      },
    });

    const product = await prisma.product.create({
      data: {
        name: "Test Product 5",
        description: "A fifth test product",
        msrpPrice: 500,
        currentPrice: 400,
        brand: "TestBrand",
        model: "TB202",
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: 500.0,
      },
    });

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        productName: "Test Product 5",
        quantity: 6,
        price: 110.0,
      },
    });

    const response = await request(app).put(
      `/api/order-items/archive/${orderItem.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(true);

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should delete an order item", async () => {
    const user = await prisma.user.create({
      data: {
        email: "testuser6@example.com",
        password: "password",
        name: "Test User 6",
        address1: "128 Test St",
        address2: "Apt 9",
        phoneNumber: "123-456-7895",
      },
    });

    const product = await prisma.product.create({
      data: {
        name: "Test Product 6",
        description: "A sixth test product",
        msrpPrice: 600,
        currentPrice: 480,
        brand: "TestBrand",
        model: "TB303",
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: 600.0,
      },
    });

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        productName: "Test Product 6",
        quantity: 7,
        price: 120.0,
      },
    });

    const response = await request(app).delete(
      `/api/order-items/${orderItem.id}`
    );

    expect(response.status).toBe(204);

    const getOrderItem = await request(app).get(
      `/api/order-items/${orderItem.id}`
    );
    expect(getOrderItem.status).toBe(404);
  });

  it("should convert cart items to order items and decrement inventory", async () => {
    const user = await prisma.user.create({
      data: {
        email: "testuser@example.com",
        password: "password",
        name: "Test User",
        address1: "123 Test St",
        address2: "Apt 4",
        phoneNumber: "123-456-7890",
      },
    });

    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "A test product",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "TestBrand",
        model: "TB123",
        quantity: 10,
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        name: "Test Variant",
        msrpPrice: 90,
        currentPrice: 70,
        productId: product.id,
        quantity: 5,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: "M",
        quantity: 3,
        variantId: variant.id,
      },
    });

    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        variantId: variant.id,
        sizeId: size.id,
        cartQuantity: 2,
        currentPrice: 70,
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: 140.0,
      },
    });

    const response = await request(app)
      .post("/api/order-items/from-cart")
      .send({
        orderId: order.id,
        cartId: cart.id,
      });

    expect(response.status).toBe(201);
    expect(response.body.length).toBe(1);
    expect(response.body[0].productName).toBe("Test Product");

    // Check inventory
    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });
    const updatedVariant = await prisma.productVariant.findUnique({
      where: { id: variant.id },
    });
    const updatedSize = await prisma.size.findUnique({
      where: { id: size.id },
    });

    if (!updatedProduct || !updatedVariant || !updatedSize) {
      throw new Error("Updated product, variant, or size not found");
    }

    expect(updatedProduct.quantity).toBe(8); // 10 - 2
    expect(updatedVariant.quantity).toBe(3); // 5 - 2
    expect(updatedSize.quantity).toBe(1); // 3 - 2

    await prisma.orderItem.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.size.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });
});
