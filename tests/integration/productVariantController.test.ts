import request from "supertest";
import app from "../../backend/src/app"; // Ensure this is your Express app
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("ProductVariant Controller", () => {
  let productId: number;
  let variantId: number;

  beforeAll(async () => {
    // Create a product first
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        msrpPrice: 200,
        currentPrice: 150,
        brand: "Test Brand",
        model: "Test Model",
        isSingleSize: false,
      },
    });
    productId = product.id;

    // Create a product variant
    const variant = await prisma.productVariant.create({
      data: {
        name: "Test Variant",
        msrpPrice: 140.0,
        currentPrice: 110.0,
        productId,
        isSingleSize: false,
      },
    });
    variantId = variant.id;
  });

  afterAll(async () => {
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.$disconnect();
  });

  it("should create a new product variant", async () => {
    const response = await request(app).post("/api/product-variants").send({
      name: "New Variant",
      msrpPrice: 120.0,
      currentPrice: 100.0,
      productId,
      isSingleSize: false,
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("New Variant");
  });

  it("should get all product variants", async () => {
    const response = await request(app).get("/api/product-variants");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a product variant by ID", async () => {
    const response = await request(app).get(
      `/api/product-variants/${variantId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test Variant");
  });

  it("should return 404 for non-existent product variant", async () => {
    const response = await request(app).get("/api/product-variants/999999");

    expect(response.status).toBe(404);
  });

  it("should update a product variant", async () => {
    const response = await request(app)
      .put(`/api/product-variants/${variantId}`)
      .send({
        name: "Updated Variant",
        msrpPrice: 130.0,
        currentPrice: 115.0,
        isSingleSize: false,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Variant");
  });

  it("should return 400 for missing required fields", async () => {
    const response = await request(app)
      .put(`/api/product-variants/${variantId}`)
      .send({
        name: "Updated Variant",
      });

    expect(response.status).toBe(400);
  });

  it("should delete a product variant", async () => {
    const response = await request(app).delete(
      `/api/product-variants/${variantId}`
    );

    expect(response.status).toBe(204);
  });

  it("should return 404 for non-existent product variant", async () => {
    const response = await request(app).delete("/api/product-variants/999999");

    expect(response.status).toBe(404);
  });

  describe("archive and unarchive product variant", () => {
    beforeAll(async () => {
      // Create a product variant for archiving
      const variant = await prisma.productVariant.create({
        data: {
          name: "Archive Test Variant",
          msrpPrice: 140.0,
          currentPrice: 110.0,
          productId,
          isSingleSize: false,
        },
      });
      variantId = variant.id;
    });

    it("should archive a product variant", async () => {
      const response = await request(app).post(
        `/api/product-variants/${variantId}/archive`
      );

      expect(response.status).toBe(200);
      expect(response.body.archived).toBe(true);
    });

    it("should unarchive a product variant", async () => {
      const response = await request(app).post(
        `/api/product-variants/${variantId}/unarchive`
      );

      expect(response.status).toBe(200);
      expect(response.body.archived).toBe(false);
    });
  });
});
