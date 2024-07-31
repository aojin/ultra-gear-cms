const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/prismaClient");

describe("Product API Endpoints", () => {
  let productId;

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new product", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Test Product",
      description: "Test Description",
      price: 100.0,
      imageUrl: "http://example.com/image.png",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    productId = res.body.id;
  });

  it("should fetch all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should update a product", async () => {
    const res = await request(app).put(`/api/products/${productId}`).send({
      name: "Updated Product",
      description: "Updated Description",
      price: 120.0,
      imageUrl: "http://example.com/updated_image.png",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Updated Product");
  });

  it("should delete a product", async () => {
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
  });
});
