const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/prismaClient");

describe("Product Variant API Endpoints", () => {
  let productId, variantId;

  beforeAll(async () => {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        price: 100.0,
        imageUrl: "http://example.com/image.png",
      },
    });
    productId = product.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new product variant", async () => {
    const res = await request(app).post("/api/product-variants").send({
      productId,
      color: "Red",
      size: "M",
      quantity: 10,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    variantId = res.body.id;
  });

  it("should fetch all product variants", async () => {
    const res = await request(app).get("/api/product-variants");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should update a product variant", async () => {
    const res = await request(app)
      .put(`/api/product-variants/${variantId}`)
      .send({
        color: "Blue",
        quantity: 20,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.color).toEqual("Blue");
  });

  it("should delete a product variant", async () => {
    const res = await request(app).delete(`/api/product-variants/${variantId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", variantId);
  });
});
