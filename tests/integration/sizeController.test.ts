import request from "supertest";
import app from "../../backend/src/app"; // Adjust the path if necessary
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Size Controller", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new size", async () => {
    const uniqueSuffix = Date.now() + Math.random();

    // Create a test product
    const testProduct = await prisma.product.create({
      data: {
        name: `Test Product ${uniqueSuffix}`,
        description: "Test Description",
        brand: "Test Brand",
        model: `Test Model ${uniqueSuffix}`,
        msrpPrice: 100.0,
        isSingleSize: false,
        quantity: 0,
      },
    });
    console.log("Test Product Created:", testProduct);

    // Create a test product variant associated with the product
    const testVariant = await prisma.productVariant.create({
      data: {
        name: `Test Variant ${uniqueSuffix}`,
        msrpPrice: 100.0,
        productId: testProduct.id,
        isSingleSize: false,
        quantity: 0,
      },
    });
    console.log("Test Variant Created:", testVariant);

    // Verify that the variant exists in the database
    const variantCheck = await prisma.productVariant.findUnique({
      where: { id: testVariant.id },
    });
    console.log("Variant Check Before Size Creation:", variantCheck);

    // Create a size associated with the variant and product
    const response = await request(app)
      .post("/api/sizes")
      .send({
        size: `M-${uniqueSuffix}`,
        quantity: 10,
        productId: testProduct.id, // Make sure this is passed correctly
        variantId: testVariant.id, // Make sure this is passed correctly
      });

    console.log("Size Creation Response:", response.body);
    expect(response.status).toBe(201);
    expect(response.body.size).toBe(`M-${uniqueSuffix}`);
    expect(response.body.quantity).toBe(10);
  });

  it("should get all sizes", async () => {
    const uniqueSuffix = Date.now() + Math.random();

    const testProduct = await prisma.product.create({
      data: {
        name: `Test Product ${uniqueSuffix}`,
        description: "Test Description",
        brand: "Test Brand",
        model: `Test Model ${uniqueSuffix}`,
        msrpPrice: 100.0,
        isSingleSize: false,
        quantity: 0,
      },
    });

    const testVariant = await prisma.productVariant.create({
      data: {
        name: `Test Variant ${uniqueSuffix}`,
        msrpPrice: 100.0,
        productId: testProduct.id,
        isSingleSize: false,
        quantity: 0,
      },
    });

    await prisma.size.create({
      data: {
        size: `M-${uniqueSuffix}`,
        quantity: 10,
        variantId: testVariant.id,
      },
    });

    const response = await request(app).get("/api/sizes");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get sizes by product ID", async () => {
    const uniqueSuffix = Date.now() + Math.random();

    const testProduct = await prisma.product.create({
      data: {
        name: `Test Product ${uniqueSuffix}`,
        description: "Test Description",
        brand: "Test Brand",
        model: `Test Model ${uniqueSuffix}`,
        msrpPrice: 100.0,
        isSingleSize: false,
        quantity: 0,
      },
    });

    await prisma.size.create({
      data: {
        size: `M-${uniqueSuffix}`,
        quantity: 10,
        productId: testProduct.id,
      },
    });

    const response = await request(app).get(
      `/api/sizes/product/${testProduct.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].productId).toBe(testProduct.id);
  });

  it("should get sizes by variant ID", async () => {
    const uniqueSuffix = Date.now() + Math.random();

    const testProduct = await prisma.product.create({
      data: {
        name: `Test Product ${uniqueSuffix}`,
        description: "Test Description",
        brand: "Test Brand",
        model: `Test Model ${uniqueSuffix}`,
        msrpPrice: 100.0,
        isSingleSize: false,
        quantity: 0,
      },
    });

    const testVariant = await prisma.productVariant.create({
      data: {
        name: `Test Variant ${uniqueSuffix}`,
        msrpPrice: 100.0,
        productId: testProduct.id,
        isSingleSize: false,
        quantity: 0,
      },
    });

    await prisma.size.create({
      data: {
        size: `M-${uniqueSuffix}`,
        quantity: 10,
        variantId: testVariant.id,
      },
    });

    const response = await request(app).get(
      `/api/sizes/variant/${testVariant.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].variantId).toBe(testVariant.id);
  });

  it("should get size by ID", async () => {
    const uniqueSuffix = Date.now() + Math.random();

    const testProduct = await prisma.product.create({
      data: {
        name: `Test Product ${uniqueSuffix}`,
        description: "Test Description",
        brand: "Test Brand",
        model: `Test Model ${uniqueSuffix}`,
        msrpPrice: 100.0,
        isSingleSize: false,
        quantity: 0,
      },
    });

    const testVariant = await prisma.productVariant.create({
      data: {
        name: `Test Variant ${uniqueSuffix}`,
        msrpPrice: 100.0,
        productId: testProduct.id,
        isSingleSize: false,
        quantity: 0,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: `M-${uniqueSuffix}`,
        quantity: 10,
        variantId: testVariant.id,
      },
    });

    const response = await request(app).get(`/api/sizes/${size.id}`);

    expect(response.status).toBe(200);
    expect(response.body.size).toBe(`M-${uniqueSuffix}`);
  });

  it("should update a size", async () => {
    const uniqueSuffix = Date.now() + Math.random();

    const testProduct = await prisma.product.create({
      data: {
        name: `Test Product ${uniqueSuffix}`,
        description: "Test Description",
        brand: "Test Brand",
        model: `Test Model ${uniqueSuffix}`,
        msrpPrice: 100.0,
        isSingleSize: false,
        quantity: 0,
      },
    });

    const testVariant = await prisma.productVariant.create({
      data: {
        name: `Test Variant ${uniqueSuffix}`,
        msrpPrice: 100.0,
        productId: testProduct.id,
        isSingleSize: false,
        quantity: 0,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: `M-${uniqueSuffix}`,
        quantity: 10,
        variantId: testVariant.id,
      },
    });

    const response = await request(app)
      .put(`/api/sizes/${size.id}`)
      .send({
        size: `L-${uniqueSuffix}`,
        quantity: 20,
      });

    expect(response.status).toBe(200);
    expect(response.body.size).toBe(`L-${uniqueSuffix}`);
    expect(response.body.quantity).toBe(20);
  });

  it("should archive a size", async () => {
    const uniqueSuffix = Date.now() + Math.random();

    const testProduct = await prisma.product.create({
      data: {
        name: `Test Product ${uniqueSuffix}`,
        description: "Test Description",
        brand: "Test Brand",
        model: `Test Model ${uniqueSuffix}`,
        msrpPrice: 100.0,
        isSingleSize: false,
        quantity: 0,
      },
    });

    const testVariant = await prisma.productVariant.create({
      data: {
        name: `Test Variant ${uniqueSuffix}`,
        msrpPrice: 100.0,
        productId: testProduct.id,
        isSingleSize: false,
        quantity: 0,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: `M-${uniqueSuffix}`,
        quantity: 10,
        variantId: testVariant.id,
      },
    });

    const response = await request(app).post(`/api/sizes/${size.id}/archive`);

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(true);
  });

  it("should unarchive a size", async () => {
    const uniqueSuffix = Date.now() + Math.random();

    const testProduct = await prisma.product.create({
      data: {
        name: `Test Product ${uniqueSuffix}`,
        description: "Test Description",
        brand: "Test Brand",
        model: `Test Model ${uniqueSuffix}`,
        msrpPrice: 100.0,
        isSingleSize: false,
        quantity: 0,
      },
    });

    const testVariant = await prisma.productVariant.create({
      data: {
        name: `Test Variant ${uniqueSuffix}`,
        msrpPrice: 100.0,
        productId: testProduct.id,
        isSingleSize: false,
        quantity: 0,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: `M-${uniqueSuffix}`,
        quantity: 10,
        variantId: testVariant.id,
        archived: true,
      },
    });

    const response = await request(app).post(`/api/sizes/${size.id}/unarchive`);

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(false);
  });

  it("should delete a size", async () => {
    const uniqueSuffix = Date.now() + Math.random();

    const testProduct = await prisma.product.create({
      data: {
        name: `Test Product ${uniqueSuffix}`,
        description: "Test Description",
        brand: "Test Brand",
        model: `Test Model ${uniqueSuffix}`,
        msrpPrice: 100.0,
        isSingleSize: false,
        quantity: 0,
      },
    });

    const testVariant = await prisma.productVariant.create({
      data: {
        name: `Test Variant ${uniqueSuffix}`,
        msrpPrice: 100.0,
        productId: testProduct.id,
        isSingleSize: false,
        quantity: 0,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: `M-${uniqueSuffix}`,
        quantity: 10,
        variantId: testVariant.id,
      },
    });

    const response = await request(app).delete(`/api/sizes/${size.id}`);

    expect(response.status).toBe(204);

    const deletedSize = await prisma.size.findUnique({
      where: { id: size.id },
    });
    expect(deletedSize).toBeNull();
  });
});
