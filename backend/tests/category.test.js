const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/prismaClient");

describe("Category API Endpoints", () => {
  let categoryId;

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new category", async () => {
    const res = await request(app).post("/api/categories").send({
      name: "Test Category",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    categoryId = res.body.id;
  });

  it("should fetch all categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should update a category", async () => {
    const res = await request(app).put(`/api/categories/${categoryId}`).send({
      name: "Updated Category",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Updated Category");
  });

  it("should delete a category", async () => {
    const res = await request(app).delete(`/api/categories/${categoryId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
  });
});
