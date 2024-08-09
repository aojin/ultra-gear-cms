import request from "supertest";
import app from "../../backend/src/app"; // Adjust the path if necessary
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("SubCategory Controller", () => {
  let categoryId: number;
  let subCategoryId: number;

  beforeAll(async () => {
    // Create a category to associate with the subcategory
    const category = await prisma.category.create({
      data: {
        name: "Test Category",
        description: "Test Category Description",
      },
    });
    categoryId = category.id;
  });

  afterAll(async () => {
    // Cleanup: delete the subcategories and category
    await prisma.subCategory.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.$executeRaw`BEGIN`;
  });

  afterEach(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });

  it("should create a new subcategory", async () => {
    const response = await request(app).post("/api/subcategories").send({
      name: "New SubCategory",
      description: "SubCategory Description",
      categoryId,
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("New SubCategory");

    subCategoryId = response.body.id;
  });

  it("should get all subcategories", async () => {
    const response = await request(app).get("/api/subcategories");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a subcategory by ID", async () => {
    const response = await request(app).get(
      `/api/subcategories/${subCategoryId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(subCategoryId);
    expect(response.body.name).toBe("New SubCategory");
  });

  it("should return 404 for non-existent subcategory", async () => {
    const response = await request(app).get("/api/subcategories/999999");

    expect(response.status).toBe(404);
  });

  it("should update a subcategory", async () => {
    const response = await request(app)
      .put(`/api/subcategories/${subCategoryId}`)
      .send({
        name: "Updated SubCategory",
        description: "Updated Description",
        categoryId,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated SubCategory");
    expect(response.body.description).toBe("Updated Description");
  });

  it("should return 400 for missing required fields when updating", async () => {
    const response = await request(app)
      .put(`/api/subcategories/${subCategoryId}`)
      .send({
        name: "", // Missing required field
      });

    expect(response.status).toBe(400);
  });

  it("should delete a subcategory", async () => {
    const response = await request(app).delete(
      `/api/subcategories/${subCategoryId}`
    );

    expect(response.status).toBe(204);

    const deletedSubCategory = await prisma.subCategory.findUnique({
      where: { id: subCategoryId },
    });
    expect(deletedSubCategory).toBeNull();
  });

  it("should return 404 when deleting a non-existent subcategory", async () => {
    const response = await request(app).delete("/api/subcategories/999999");

    expect(response.status).toBe(404);
  });
});
