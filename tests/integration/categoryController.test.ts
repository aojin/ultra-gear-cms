import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "../../backend/src/app"; // Adjust the path as necessary

const prisma = new PrismaClient();

let uncategorizedCategoryId: number;

describe("Category Controller", () => {
  let testCategoryId: number;
  let originalConsoleError: any;

  beforeAll(async () => {
    originalConsoleError = console.error;

    // Ensure the "Uncategorized" category exists
    const uncategorizedCategory = await prisma.category.upsert({
      where: { name: "Uncategorized" },
      update: {},
      create: {
        name: "Uncategorized",
        description: "Default category for uncategorized products",
      },
    });
    uncategorizedCategoryId = uncategorizedCategory.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Ensure a clean state
    await prisma.category.deleteMany({
      where: {
        name: { not: "Uncategorized" },
      },
    });

    // Creating necessary data for the tests
    const category = await prisma.category.create({
      data: {
        name: "Test Category",
        description: "A category for testing purposes",
      },
    });
    testCategoryId = category.id;
  });

  it("should create a new category", async () => {
    const response = await request(app).post("/api/categories").send({
      name: "New Category",
      description: "Another category for testing purposes",
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("New Category");
  });

  it("should not create a category with the name 'Uncategorized'", async () => {
    const response = await request(app).post("/api/categories").send({
      name: "Uncategorized",
      description: "Trying to create a category with the reserved name",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Cannot create a category with the name 'Uncategorized'"
    );
  });

  it("should not create a duplicate category", async () => {
    const response = await request(app).post("/api/categories").send({
      name: "Test Category",
      description: "Trying to create a duplicate category",
    });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe(
      "Category with the name 'Test Category' already exists"
    );
  });

  it("should get all categories", async () => {
    const response = await request(app).get("/api/categories");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get category by id", async () => {
    const response = await request(app).get(
      `/api/categories/${testCategoryId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test Category");
  });

  it("should update a category", async () => {
    const response = await request(app)
      .put(`/api/categories/${testCategoryId}`)
      .send({
        name: "Updated Category",
        description: "An updated category for testing purposes",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Category");
  });

  it("should not update the Uncategorized category", async () => {
    const response = await request(app)
      .put(`/api/categories/${uncategorizedCategoryId}`)
      .send({
        name: "Updated Uncategorized Category",
        description: "Trying to update the uncategorized category",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Cannot update the Uncategorized category"
    );
  });

  it("should not delete the Uncategorized category", async () => {
    const response = await request(app).delete(
      `/api/categories/${uncategorizedCategoryId}`
    );

    expect(response.status).toBe(400); // or whatever status you choose to return for this error
    expect(response.body.error).toBe(
      "Cannot delete the Uncategorized category"
    );
  });

  it("should delete a category", async () => {
    const response = await request(app).delete(
      `/api/categories/${testCategoryId}`
    );

    expect(response.status).toBe(204);
  });
});
