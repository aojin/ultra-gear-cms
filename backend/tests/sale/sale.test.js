const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Sale Model Tests", () => {
  let saleId;

  beforeAll(async () => {
    // Ensure unique constraint is not violated by deleting existing test data

    const sale = await prisma.sale.create({
      data: {
        name: "Test Sale",
        title: "Test Title",
        tagline: "Test Tagline",
        startDate: new Date(),
        endDate: new Date(),
      },
    });
    saleId = sale.id;
  });

  test("should create a Sale", async () => {
    const newSale = await prisma.sale.create({
      data: {
        name: "New Test Sale",
        title: "New Test Title",
        tagline: "New Test Tagline",
        startDate: new Date(),
        endDate: new Date(),
      },
    });
    expect(newSale).toHaveProperty("id");
    await prisma.sale.delete({ where: { id: newSale.id } }); // Clean up
  });

  test("should read a Sale", async () => {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
    });
    expect(sale).toHaveProperty("id");
  });

  test("should update a Sale", async () => {
    const sale = await prisma.sale.update({
      where: { id: saleId },
      data: { name: "Updated Sale" },
    });
    expect(sale.name).toBe("Updated Sale");
  });

  test("should delete a Sale", async () => {
    await prisma.sale.delete({
      where: { id: saleId },
    });
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
    });
    expect(sale).toBeNull();
  });
});
