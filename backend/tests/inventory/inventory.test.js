const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Inventory Model Tests", () => {
  let inventoryId;
  let productId;

  beforeAll(async () => {
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
  });

  test("should create an Inventory", async () => {
    const inventory = await prisma.inventory.create({
      data: {
        productId: productId,
        quantity: 10,
      },
    });
    expect(inventory).toHaveProperty("id");
    inventoryId = inventory.id;
  });

  test("should read an Inventory", async () => {
    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });
    expect(inventory).toHaveProperty("id");
    expect(inventory.productId).toBe(productId);
  });

  test("should update an Inventory", async () => {
    const inventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity: 20,
      },
    });
    expect(inventory).toHaveProperty("id");
    expect(inventory.quantity).toBe(20);
  });

  test("should delete an Inventory", async () => {
    const inventory = await prisma.inventory.delete({
      where: { id: inventoryId },
    });
    expect(inventory).toHaveProperty("id");
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
