const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const app = require("../../app");

const prisma = new PrismaClient();

describe("Category API Tests with Relations", () => {
  let categoryId, productId, subCategoryId;

  beforeAll(async () => {
    await prisma.$connect();

    // Create a Category
    const category = await prisma.category.create({
      data: {
        name: "Test Category",
        description: "Test Description",
      },
    });
    categoryId = category.id;

    // Create a Product related to the Category
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Product Description",
        msrpPrice: 100.0,
        currentPrice: 80.0,
        brand: "Test Brand",
        model: "Test Model",
        categories: {
          connect: { id: categoryId },
        },
      },
    });
    productId = product.id;

    // Create a SubCategory related to the Category
    const subCategory = await prisma.subCategory.create({
      data: {
        name: "Test SubCategory",
        description: "Test SubCategory Description",
        categoryId: categoryId,
      },
    });
    subCategoryId = subCategory.id;
  });

  afterAll(async () => {
    try {
      if (subCategoryId) {
        await prisma.subCategory.delete({ where: { id: subCategoryId } });
      }
      if (productId) {
        await prisma.product.delete({ where: { id: productId } });
      }
      if (categoryId) {
        await prisma.category.delete({ where: { id: categoryId } });
      }
      await prisma.$disconnect();
    } catch (error) {
      console.error("Error during teardown:", error);
    }
  });

  it("should create a new Category", async () => {
    const res = await request(app).post("/api/categories").send({
      name: "Another Test Category",
      description: "Another Test Description",
    });
    console.log("Create Category Response:", res.body); // Add logging
    console.log("Create Category Status Code:", res.statusCode); // Add logging
    expect(res.statusCode).toEqual(201); // Expect 201 for created resource
    expect(res.body).toHaveProperty("id");
  });

  it("should fetch all categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should update a Category", async () => {
    const res = await request(app).put(`/api/categories/${categoryId}`).send({
      name: "Updated Category",
    });
    console.log("Update Category Response:", res.body); // Add logging
    console.log("Update Category Status Code:", res.statusCode); // Add logging
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Updated Category");
  });

  it("should delete a Category", async () => {
    const res = await request(app).delete(`/api/categories/${categoryId}`);
    console.log("Delete Category Response:", res.body); // Add logging
    console.log("Delete Category Status Code:", res.statusCode); // Add logging
    expect(res.statusCode).toEqual(204); // Expect 204 No Content for successful deletion

    // Verify deletion
    const deletedRes = await request(app).get(`/api/categories/${categoryId}`);
    expect(deletedRes.statusCode).toBe(404);
  });
});
