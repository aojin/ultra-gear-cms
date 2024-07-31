// backend/tests/productImage.test.js
const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/prismaClient");

describe("Product Image API Endpoints", () => {
  let imageId, productId;

  beforeAll(async () => {
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});

    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        price: 100,
        imageUrl: "http://example.com/image.png",
      },
    });
    productId = product.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new product image", async () => {
    const res = await request(app).post("/api/product-images").send({
      url: "http://example.com/image.png",
      productId,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    imageId = res.body.id;
  });

  it("should update a product image", async () => {
    const res = await request(app).put(`/api/product-images/${imageId}`).send({
      url: "http://example.com/updated_image.png",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.url).toEqual("http://example.com/updated_image.png");
  });

  it("should delete a product image", async () => {
    const res = await request(app).delete(`/api/product-images/${imageId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", imageId);
  });
});
