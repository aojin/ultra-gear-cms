import request from "supertest";
import app from "../../backend/src/app"; // Adjust the path as necessary
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Category Controller", () => {
  let testCategoryId: number;

  beforeAll(async () => {
    await prisma.category.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
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

  it("should delete a category", async () => {
    const response = await request(app).delete(
      `/api/categories/${testCategoryId}`
    );

    expect(response.status).toBe(204);
  });
});
