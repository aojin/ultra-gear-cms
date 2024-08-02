const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Category Model Tests", () => {
  let categoryId;

  test("should create a Category", async () => {
    const category = await prisma.category.create({
      data: {
        name: "Test Category",
        description: "Test Description",
      },
    });
    expect(category).toHaveProperty("id");
    categoryId = category.id;
  });

  test("should read a Category", async () => {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    expect(category).toHaveProperty("id");
    expect(category.name).toBe("Test Category");
  });

  test("should update a Category", async () => {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: "Updated Category",
      },
    });
    expect(category).toHaveProperty("id");
    expect(category.name).toBe("Updated Category");
  });

  test("should delete a Category", async () => {
    const category = await prisma.category.delete({
      where: { id: categoryId },
    });
    expect(category).toHaveProperty("id");
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
