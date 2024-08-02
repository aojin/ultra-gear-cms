const request = require("supertest");
const app = require("../../app");
const prisma = require("../../prisma/prismaClient");

describe("Order API Tests", () => {
  let userId, productId, variantId, orderId;

  beforeAll(async () => {
    try {
      // Create a user
      const user = await prisma.user.create({
        data: {
          email: `testuser-${Date.now()}@example.com`,
          password: "securepassword123",
        },
      });
      userId = user.id;

      // Create a product
      const product = await prisma.product.create({
        data: {
          name: "Test Product",
          description: "Test Product Description",
          msrpPrice: 100.0,
          currentPrice: 80.0,
          brand: "Test Brand",
          model: "Test Model",
        },
      });
      productId = product.id;

      // Create a product variant
      const variant = await prisma.productVariant.create({
        data: {
          name: "Test Variant",
          msrpPrice: 100.0,
          currentPrice: 80.0,
          productId: product.id,
        },
      });
      variantId = variant.id;
    } catch (error) {
      console.error("Error setting up test data:", error);
    }
  });

  afterAll(async () => {
    try {
      // Clean up test data
      if (orderId) {
        const orderExists = await prisma.order.findUnique({
          where: { id: orderId },
        });
        if (orderExists) {
          await prisma.order.delete({ where: { id: orderId } });
        }
      }
      if (variantId) {
        const variantExists = await prisma.productVariant.findUnique({
          where: { id: variantId },
        });
        if (variantExists) {
          await prisma.productVariant.delete({ where: { id: variantId } });
        }
      }
      if (productId) {
        const productExists = await prisma.product.findUnique({
          where: { id: productId },
        });
        if (productExists) {
          await prisma.product.delete({ where: { id: productId } });
        }
      }
      if (userId) {
        const userExists = await prisma.user.findUnique({
          where: { id: userId },
        });
        if (userExists) {
          await prisma.user.delete({ where: { id: userId } });
        }
      }
    } catch (error) {
      console.error("Error cleaning up test data:", error);
    }
  });

  it("should create a new Order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        userId: userId,
        totalAmount: 100.0,
        orderItems: [
          {
            productId: productId,
            variantId: variantId,
            quantity: 2,
            price: 50.0,
          },
        ],
      });

    if (res.statusCode !== 201) {
      console.error("Error creating order:", res.body); // Log error details only if not 201
    }
    expect(res.statusCode).toEqual(201); // Adjusted to 201 Created
    expect(res.body).toHaveProperty("id");
    orderId = res.body.id; // Save orderId for further tests
    console.log("Order created with ID:", orderId);
  });

  it("should retrieve an Order by ID", async () => {
    // Create an order for this specific test
    const createRes = await request(app)
      .post("/api/orders")
      .send({
        userId: userId,
        totalAmount: 100.0,
        orderItems: [
          {
            productId: productId,
            variantId: variantId,
            quantity: 2,
            price: 50.0,
          },
        ],
      });

    if (createRes.statusCode !== 201) {
      console.error("Error creating order for retrieval:", createRes.body); // Log error details only if not 201
    }
    expect(createRes.statusCode).toEqual(201);
    const newOrderId = createRes.body.id;
    console.log("Order created for retrieval with ID:", newOrderId);

    // Delay to ensure database has committed the transaction
    await new Promise((resolve) => setTimeout(resolve, 100));

    const res = await request(app).get(`/api/orders/${newOrderId}`);
    console.log("Retrieve order response:", res.body);
    if (res.statusCode !== 200) {
      console.error("Error retrieving order:", res.body); // Log error details only if not 200
    }
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", newOrderId);
    expect(res.body.orderItems).toHaveLength(1);
  });

  it("should update an Order", async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}`)
      .send({
        totalAmount: 200.0,
        orderItems: [
          {
            productId: productId,
            variantId: variantId,
            quantity: 4,
            price: 50.0,
          },
        ],
      });

    if (res.statusCode !== 200) {
      console.error("Error updating order:", res.body); // Log error details only if not 200
    }
    expect(res.statusCode).toEqual(200); // Adjusted to 200 OK
    expect(res.body).toHaveProperty("id");
    expect(res.body.orderItems).toHaveLength(1);
    console.log("Order updated with new totalAmount:", res.body.totalAmount);
  });

  it("should delete an Order", async () => {
    const res = await request(app).delete(`/api/orders/${orderId}`);
    expect(res.statusCode).toEqual(204); // Expecting 204 for successful deletion
    console.log("Order deleted with ID:", orderId);

    // Verify deletion
    const checkRes = await request(app).get(`/api/orders/${orderId}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
