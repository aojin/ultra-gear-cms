const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Order Model Tests", () => {
  let userId, orderId;

  beforeAll(async () => {
    // Create a unique user for testing
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: `testuser-${Date.now()}@example.com`, // Ensure unique email
        password: "password123",
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    // Clean up specific entries
    if (orderId) {
      const orderExists = await prisma.order.findUnique({
        where: { id: orderId },
      });
      if (orderExists) {
        try {
          await prisma.order.delete({ where: { id: orderId } });
        } catch (error) {
          console.error("Error deleting order during teardown:", error);
        }
      }
    }
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (userExists) {
        try {
          await prisma.user.delete({ where: { id: userId } });
        } catch (error) {
          console.error("Error deleting user during teardown:", error);
        }
      }
    }
    await prisma.$disconnect();
  });

  test("should create an Order", async () => {
    const order = await prisma.order.create({
      data: {
        userId: userId,
        totalAmount: 90.0,
      },
    });
    expect(order).toHaveProperty("id");
    orderId = order.id;
  });

  test("should read an Order", async () => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    expect(order).toHaveProperty("id");
    expect(order.totalAmount).toBe(90.0);
  });

  test("should update an Order", async () => {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount: 150.0,
      },
    });
    expect(order).toHaveProperty("id");
    expect(order.totalAmount).toBe(150.0);
  });

  test("should delete an Order", async () => {
    const order = await prisma.order.delete({
      where: { id: orderId },
    });
    expect(order).toHaveProperty("id");
  });
});
