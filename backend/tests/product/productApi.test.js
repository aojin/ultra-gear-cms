const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const app = require("../../app");

const prisma = new PrismaClient();

describe("Product API Tests", () => {
  let productId, categoryId, subCategoryId, inventoryId, sizeId, productImageId;

  beforeAll(async () => {
    await prisma.$connect();

    // Create a category for the product
    const category = await prisma.category.create({
      data: {
        name: "Test Category",
        description: "Test Category Description",
      },
    });
    categoryId = category.id;

    // Create a subcategory for the product
    const subCategory = await prisma.subCategory.create({
      data: {
        name: "Test SubCategory",
        description: "Test SubCategory Description",
        categoryId: categoryId,
      },
    });
    subCategoryId = subCategory.id;

    // Create an initial product for testing
    const product = await prisma.product.create({
      data: {
        name: "Initial Test Product",
        description: "Initial Test Product Description",
        msrpPrice: 100.0,
        currentPrice: 80.0,
        brand: "Test Brand",
        model: "Test Model",
        categories: { connect: { id: categoryId } },
        subcategories: { connect: { id: subCategoryId } },
      },
    });
    productId = product.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should create a new Product", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({
        name: "Test Product",
        description: "Test Product Description",
        msrpPrice: 120.0,
        currentPrice: 90.0,
        brand: "Test Brand",
        model: "Test Model",
        categories: [categoryId],
        subcategories: [subCategoryId],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    productId = res.body.id;
  });

  test("should get a single Product", async () => {
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", productId);
    expect(res.body.name).toBe("Test Product");
  });

  test("should update a Product", async () => {
    const res = await request(app).put(`/api/products/${productId}`).send({
      name: "Updated Test Product",
      description: "Updated Test Product Description",
      msrpPrice: 150.0,
      currentPrice: 110.0,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", productId);
    expect(res.body.name).toBe("Updated Test Product");
  });

  test("should delete a Product", async () => {
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.statusCode).toBe(204); // No Content
  });

  test("should get all Products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
