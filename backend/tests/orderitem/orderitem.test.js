const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("OrderItem Model Tests", () => {
  let orderId, productId, variantId, orderItemId, userId;

  beforeAll(async () => {
    // Create a user for the order
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: `testuser-${Date.now()}@example.com`, // Ensure unique email
        password: "password123",
      },
    });
    userId = user.id;

    // Create an order for testing
    const order = await prisma.order.create({
      data: {
        userId: userId,
        totalAmount: 90.0,
      },
    });
    orderId = order.id;

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

    // Create a product variant for testing
    const variant = await prisma.productVariant.create({
      data: {
        name: "Test Variant",
        msrpPrice: 100.0,
        currentPrice: 90.0,
        productId: productId,
      },
    });
    variantId = variant.id;
  });

  afterAll(async () => {
    // Clean up specific entries
    if (orderItemId) {
      try {
        await prisma.orderItem.delete({ where: { id: orderItemId } });
      } catch (error) {
        console.error(
          `Failed to delete orderItem with id ${orderItemId}:`,
          error
        );
      }
    }
    if (variantId) {
      try {
        await prisma.productVariant.delete({ where: { id: variantId } });
      } catch (error) {
        console.error(`Failed to delete variant with id ${variantId}:`, error);
      }
    }
    if (productId) {
      try {
        await prisma.product.delete({ where: { id: productId } });
      } catch (error) {
        console.error(`Failed to delete product with id ${productId}:`, error);
      }
    }
    if (orderId) {
      try {
        await prisma.order.delete({ where: { id: orderId } });
      } catch (error) {
        console.error(`Failed to delete order with id ${orderId}:`, error);
      }
    }
    if (userId) {
      try {
        await prisma.user.delete({ where: { id: userId } });
      } catch (error) {
        console.error(`Failed to delete user with id ${userId}:`, error);
      }
    }
    await prisma.$disconnect();
  });

  test("should create an OrderItem", async () => {
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: orderId,
        productId: productId,
        variantId: variantId,
        quantity: 2,
        price: 180.0,
      },
    });
    expect(orderItem).toHaveProperty("id");
    orderItemId = orderItem.id;
  });

  test("should read an OrderItem", async () => {
    if (!orderItemId) {
      throw new Error("OrderItem ID is undefined");
    }
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
    });
    expect(orderItem).toHaveProperty("id");
    expect(orderItem.quantity).toBe(2);
  });

  test("should update an OrderItem", async () => {
    if (!orderItemId) {
      throw new Error("OrderItem ID is undefined");
    }
    const orderItem = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        quantity: 3,
      },
    });
    expect(orderItem).toHaveProperty("id");
    expect(orderItem.quantity).toBe(3);
  });

  test("should delete an OrderItem", async () => {
    if (!orderItemId) {
      throw new Error("OrderItem ID is undefined");
    }
    const orderItem = await prisma.orderItem.delete({
      where: { id: orderItemId },
    });
    expect(orderItem).toHaveProperty("id");
  });
});
