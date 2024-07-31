const request = require("supertest");
const app = require("../app");
const prisma = require("../prisma/prismaClient");

describe("Inventory API Endpoints", () => {
  let inventoryId;
  let productId;

  beforeAll(async () => {
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

  it("should create a new inventory item", async () => {
    const res = await request(app).post("/api/inventories").send({
      productId: productId,
      quantity: 10,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    inventoryId = res.body.id;
  });

  it("should fetch all inventory items", async () => {
    const res = await request(app).get("/api/inventories");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should update an inventory item", async () => {
    const res = await request(app).put(`/api/inventories/${inventoryId}`).send({
      quantity: 20,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.quantity).toEqual(20);
  });

  it("should delete an inventory item", async () => {
    const res = await request(app).delete(`/api/inventories/${inventoryId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
  });
});
