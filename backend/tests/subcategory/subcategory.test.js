const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("SubCategory Model Tests", () => {
  let subCategoryId;
  let categoryId;

  beforeAll(async () => {
    let category = await prisma.category.findFirst({
      where: { name: "Test Category" },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "Test Category",
          description: "Test Category Description",
        },
      });
    }

    categoryId = category.id;

    let subCategory = await prisma.subCategory.findFirst({
      where: { name: "Test SubCategory" },
    });

    if (!subCategory) {
      subCategory = await prisma.subCategory.create({
        data: {
          name: "Test SubCategory",
          description: "Test SubCategory Description",
          categoryId: categoryId,
        },
      });
    }

    subCategoryId = subCategory.id;
  });

  test("should create a SubCategory", async () => {
    const newSubCategory = await prisma.subCategory.create({
      data: {
        name: "New Test SubCategory",
        description: "New Test SubCategory Description",
        categoryId: categoryId,
      },
    });
    expect(newSubCategory).toHaveProperty("id");
    await prisma.subCategory.delete({ where: { id: newSubCategory.id } }); // Clean up
  });

  test("should read a SubCategory", async () => {
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: subCategoryId },
    });
    expect(subCategory).toHaveProperty("id");
  });

  test("should update a SubCategory", async () => {
    const subCategory = await prisma.subCategory.update({
      where: { id: subCategoryId },
      data: { name: "Updated SubCategory" },
    });
    expect(subCategory.name).toBe("Updated SubCategory");
  });

  test("should delete a SubCategory", async () => {
    await prisma.subCategory.delete({
      where: { id: subCategoryId },
    });
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: subCategoryId },
    });
    expect(subCategory).toBeNull();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
