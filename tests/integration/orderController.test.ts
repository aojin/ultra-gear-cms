import request from "supertest";
import app from "../../backend/src/app"; // Adjust the path as necessary
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Order Controller", () => {
  afterEach(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new order", async () => {
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

    const response = await request(app)
      .post("/api/orders")
      .send({
        userId: user.id,
        orderItems: [
          {
            productId: 1,
            productVariantId: 1,
            quantity: 2,
            price: 50.0,
            productName: "Test Product",
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.orderItems.length).toBe(1);
    expect(response.body.orderItems[0].productName).toBe("Test Product");

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should get all orders", async () => {
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

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderItems: {
          create: [
            {
              productId: 2,
              productVariantId: 2,
              quantity: 3,
              price: 50.0,
              productName: "Test Product 2",
            },
          ],
        },
      },
    });

    const response = await request(app).get("/api/orders");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should get order by ID", async () => {
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

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderItems: {
          create: [
            {
              productId: 3,
              productVariantId: 3,
              quantity: 4,
              price: 50.0,
              productName: "Test Product 3",
            },
          ],
        },
      },
    });

    const response = await request(app).get(`/api/orders/${order.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(order.id);
    expect(response.body.orderItems.length).toBe(1);
    expect(response.body.orderItems[0].productName).toBe("Test Product 3");

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should update an order", async () => {
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

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderItems: {
          create: [
            {
              productId: 4,
              productVariantId: 4,
              quantity: 5,
              price: 50.0,
              productName: "Test Product 4",
            },
            {
              productId: 8,
              productVariantId: 5,
              quantity: 6,
              price: 50.0,
              productName: "Updated Product",
            },
          ],
        },
      },
    });

    const response = await request(app)
      .put(`/api/orders/${order.id}`)
      .send({
        orderItems: [
          {
            productId: 5,
            productVariantId: 5,
            quantity: 6,
            price: 50.0,
            productName: "Updated Product",
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.orderItems).toBeDefined(); // Ensure orderItems is defined
    expect(response.body.orderItems.length).toBe(1);
    expect(response.body.orderItems[0].productName).toBe("Updated Product");

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should archive an order", async () => {
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

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderItems: {
          create: [
            {
              productId: 6,
              productVariantId: 6,
              quantity: 7,
              price: 50.0,
              productName: "Test Product 5",
            },
          ],
        },
      },
    });

    const response = await request(app).put(`/api/orders/archive/${order.id}`);

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(true);

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should unarchive an order", async () => {
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

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderItems: {
          create: [
            {
              productId: 7,
              productVariantId: 7,
              quantity: 8,
              price: 50.0,
              productName: "Test Product 6",
            },
          ],
        },
        archived: true,
      },
    });

    const response = await request(app).put(
      `/api/orders/unarchive/${order.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(false);

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should permanently delete an order", async () => {
    const user = await prisma.user.create({
      data: {
        email: "testuser7@example.com",
        password: "password",
        name: "Test User 7",
        address1: "129 Test St",
        address2: "Apt 10",
        phoneNumber: "123-456-7896",
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderItems: {
          create: [
            {
              productId: 8,
              productVariantId: 8,
              quantity: 9,
              price: 50.0,
              productName: "Test Product 7",
            },
          ],
        },
      },
    });

    const response = await request(app).delete(`/api/orders/${order.id}`);

    expect(response.status).toBe(204);

    // Verify the order is deleted
    const getOrderResponse = await request(app).get(`/api/orders/${order.id}`);
    expect(getOrderResponse.status).toBe(404);

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should ensure user details are present in order", async () => {
    const user = await prisma.user.create({
      data: {
        email: "testuser8@example.com",
        password: "password",
        name: "Test User 8",
        address1: "130 Test St",
        address2: "Apt 11",
        phoneNumber: "123-456-7897",
      },
    });

    const response = await request(app)
      .post("/api/orders")
      .send({
        userId: user.id,
        orderItems: [
          {
            productId: 9,
            productVariantId: 9,
            quantity: 10,
            price: 50.0,
            productName: "Another Test Product",
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.userName).toBe("Test User 8");
    expect(response.body.userEmail).toBe("testuser8@example.com");
    expect(response.body.userAddress1).toBe("130 Test St");
    expect(response.body.userAddress2).toBe("Apt 11");
    expect(response.body.userPhoneNumber).toBe("123-456-7897");

    const newOrderId = response.body.id;

    // Clean up the new order
    await request(app).delete(`/api/orders/${newOrderId}`);
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
  });
});
