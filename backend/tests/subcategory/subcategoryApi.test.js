const request = require("supertest");
const app = require("../../app");
const prisma = require("../../prisma/prismaClient");

describe("SubCategory API Tests", () => {
  let subCategoryId;
  let categoryId;

  beforeAll(async () => {
    // Create a category to associate with the subcategory
    const category = await prisma.category.create({
      data: {
        name: "Test Category",
      },
    });
    categoryId = category.id;

    // Create a subcategory for testing
    const res = await request(app).post("/api/subcategories").send({
      name: "Test SubCategory",
      description: "Test Description",
      categoryId: categoryId,
    });
    // Ensure subCategoryId is properly set
    subCategoryId = res.body.id;
  });

  afterAll(async () => {
    // Cleanup specific instances created in this test suite
    try {
      if (subCategoryId) {
        // Check if the subcategory exists before deleting
        const subCategory = await prisma.subCategory.findUnique({
          where: { id: subCategoryId },
        });
        if (subCategory) {
          await prisma.subCategory.delete({ where: { id: subCategoryId } });
        } else {
          console.log("SubCategory not found, skipping delete.");
        }
      }

      if (categoryId) {
        // Check if the category exists before deleting
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });
        if (category) {
          await prisma.category.delete({ where: { id: categoryId } });
        } else {
          console.log("Category not found, skipping delete.");
        }
      }
    } catch (error) {
      console.error("Error during teardown:", error);
    }
  });

  it("should create a subcategory", async () => {
    const res = await request(app).post("/api/subcategories").send({
      name: "Another SubCategory",
      description: "Another Description",
      categoryId: categoryId,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Another SubCategory");
  });

  it("should get a single subcategory", async () => {
    const res = await request(app).get(`/api/subcategories/${subCategoryId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", subCategoryId);
    expect(res.body.name).toBe("Test SubCategory");
  });

  it("should update a subcategory", async () => {
    const res = await request(app)
      .put(`/api/subcategories/${subCategoryId}`)
      .send({
        name: "Updated SubCategory",
        description: "Updated Description",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", subCategoryId);
    expect(res.body.name).toBe("Updated SubCategory");
  });

  it("should delete a subcategory", async () => {
    const res = await request(app).delete(
      `/api/subcategories/${subCategoryId}`
    );
    expect(res.statusCode).toEqual(204); // No content on successful deletion

    // Verify deletion
    const checkRes = await request(app).get(
      `/api/subcategories/${subCategoryId}`
    );
    expect(checkRes.statusCode).toEqual(404); // Not found
  });
});
