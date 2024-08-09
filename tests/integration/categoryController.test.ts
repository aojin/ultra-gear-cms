import request from "supertest";
import app from "../../backend/src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const uniqueSuffix = Date.now();

describe("Category Controller", () => {
  let testCategoryId: number;
  let uncategorizedCategoryId: number;

  beforeAll(async () => {
    // Ensure the "Uncategorized" category exists
    const uncategorizedCategory = await prisma.category.upsert({
      where: { name: `Uncategorized_${uniqueSuffix}` },
      update: {},
      create: {
        name: `Uncategorized_${uniqueSuffix}`,
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
        name: { not: `Uncategorized_${uniqueSuffix}` },
      },
    });

    // Creating necessary data for the tests
    const category = await prisma.category.create({
      data: {
        name: `Test Category ${uniqueSuffix}`,
        description: "A category for testing purposes",
      },
    });
    testCategoryId = category.id;
  });

  it("should create a new category", async () => {
    const response = await request(app)
      .post("/api/categories")
      .send({
        name: `New Category ${uniqueSuffix}`,
        description: "Another category for testing purposes",
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(`New Category ${uniqueSuffix}`);
  });

  it("should not create a category with the name 'Uncategorized'", async () => {
    const response = await request(app)
      .post("/api/categories")
      .send({
        name: `Uncategorized_${uniqueSuffix}`,
        description: "Trying to create a category with the reserved name",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      `Cannot create a category with the name 'Uncategorized'`
    );
  });

  it("should not create a duplicate category", async () => {
    const response = await request(app)
      .post("/api/categories")
      .send({
        name: `Test Category ${uniqueSuffix}`,
        description: "Trying to create a duplicate category",
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe(
      `Category with the name 'Test Category ${uniqueSuffix}' already exists`
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
    expect(response.body.name).toBe(`Test Category ${uniqueSuffix}`);
  });

  it("should update a category", async () => {
    const response = await request(app)
      .put(`/api/categories/${testCategoryId}`)
      .send({
        name: `Updated Category ${uniqueSuffix}`,
        description: "An updated category for testing purposes",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(`Updated Category ${uniqueSuffix}`);
  });

  it("should not update the Uncategorized category", async () => {
    const response = await request(app)
      .put(`/api/categories/${uncategorizedCategoryId}`)
      .send({
        name: `Updated Uncategorized Category ${uniqueSuffix}`,
        description: "Trying to update the uncategorized category",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      `Cannot update the Uncategorized category`
    );
  });

  it("should not delete the Uncategorized category", async () => {
    const response = await request(app).delete(
      `/api/categories/${uncategorizedCategoryId}`
    );

    expect(response.status).toBe(400); // or whatever status you choose to return for this error
    expect(response.body.error).toBe(
      `Cannot delete the Uncategorized category`
    );
  });

  it("should delete a category", async () => {
    const response = await request(app).delete(
      `/api/categories/${testCategoryId}`
    );

    expect(response.status).toBe(204);
  });
});
