import request from "supertest";
import app from "../../backend/src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Product Image Controller", () => {
  let productId: number;
  let variantId: number;
  let productImageId: number;

  beforeAll(async () => {
    // Clean up test database
    await prisma.productImage.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});

    // Create test product and variant
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        msrpPrice: 100,
        currentPrice: 90,
        brand: "Test Brand",
        model: "Test Model",
        quantity: 10,
      },
    });

    productId = product.id;

    const variant = await prisma.productVariant.create({
      data: {
        name: "Test Variant",
        msrpPrice: 100,
        currentPrice: 90,
        productId: product.id,
        isSingleSize: true,
        quantity: 10,
      },
    });

    variantId = variant.id;
  });

  afterAll(async () => {
    // Clean up test database
    await prisma.productImage.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.$disconnect();
  });

  it("should create a new product image", async () => {
    const response = await request(app).post("/api/product-images").send({
      url: "http://example.com/image.jpg",
      order: 1,
      productId,
      productVariantId: variantId,
    });

    expect(response.status).toBe(201);
    expect(response.body.url).toBe("http://example.com/image.jpg");
    productImageId = response.body.id;
  });

  it("should get all product images", async () => {
    const response = await request(app).get("/api/product-images");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a product image by ID", async () => {
    const response = await request(app).get(
      `/api/product-images/${productImageId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.url).toBe("http://example.com/image.jpg");
  });

  it("should get all product images by product ID", async () => {
    const response = await request(app).get(
      `/api/product-images/product/${productId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get all product variant images by variant ID", async () => {
    const response = await request(app).get(
      `/api/product-images/variant/${variantId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should update a product image", async () => {
    const response = await request(app)
      .put(`/api/product-images/${productImageId}`)
      .send({
        url: "http://example.com/new-image.jpg",
        order: 2,
        productId,
        productVariantId: variantId,
      });

    expect(response.status).toBe(200);
    expect(response.body.url).toBe("http://example.com/new-image.jpg");
  });

  it("should archive a product image", async () => {
    const response = await request(app)
      .put(`/api/product-images/archive/${productImageId}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(true);
  });

  it("should unarchive a product image", async () => {
    const response = await request(app)
      .put(`/api/product-images/unarchive/${productImageId}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(false);
  });

  it("should delete a product image", async () => {
    const response = await request(app).delete(
      `/api/product-images/${productImageId}`
    );

    expect(response.status).toBe(204);
  });

  it("should return 404 for non-existent product image by ID", async () => {
    const response = await request(app).get("/api/product-images/999999");

    expect(response.status).toBe(404);
  });

  it("should return 404 when updating a non-existent product image", async () => {
    const response = await request(app).put("/api/product-images/999999").send({
      url: "http://example.com/non-existent.jpg",
      order: 3,
      productId,
      productVariantId: variantId,
    });

    expect(response.status).toBe(404);
  });

  it("should return 404 when archiving a non-existent product image", async () => {
    const response = await request(app).put(
      "/api/product-images/archive/999999"
    );

    expect(response.status).toBe(404);
  });

  it("should return 404 when unarchiving a non-existent product image", async () => {
    const response = await request(app).put(
      "/api/product-images/unarchive/999999"
    );

    expect(response.status).toBe(404);
  });

  it("should return 404 when deleting a non-existent product image", async () => {
    const response = await request(app).delete("/api/product-images/999999");

    expect(response.status).toBe(404);
  });
});
