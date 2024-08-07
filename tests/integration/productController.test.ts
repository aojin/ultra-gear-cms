import request from "supertest";
import app from "../../backend/src/app"; // Adjust the path as necessary
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Product Controller", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new product", async () => {
    const response = await request(app).post("/api/products").send({
      name: "New Product",
      description: "A new product for testing purposes",
      brand: "Test Brand",
      model: "Test Model",
      msrpPrice: 100.0,
      isSingleSize: true,
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("New Product");

    // Clean up
    await prisma.product.delete({ where: { id: response.body.id } });
  });

  it("should get all products", async () => {
    // Create a test product
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "A product for testing purposes",
        brand: "Test Brand",
        model: "Test Model",
        msrpPrice: 100.0,
        isSingleSize: true,
      },
    });

    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);

    // Clean up
    await prisma.product.delete({ where: { id: product.id } });
  });

  it("should get product by id", async () => {
    // Create a test product
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "A product for testing purposes",
        brand: "Test Brand",
        model: "Test Model",
        msrpPrice: 100.0,
        isSingleSize: true,
      },
    });

    const response = await request(app).get(`/api/products/${product.id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test Product");

    // Clean up
    await prisma.product.delete({ where: { id: product.id } });
  });

  it("should update a product", async () => {
    // Create a test product
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "A product for testing purposes",
        brand: "Test Brand",
        model: "Test Model",
        msrpPrice: 100.0,
        isSingleSize: true,
      },
    });

    const response = await request(app)
      .put(`/api/products/${product.id}`)
      .send({
        name: "Updated Product",
        description: "An updated product for testing purposes",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Product");

    // Clean up
    await prisma.product.delete({ where: { id: product.id } });
  });

  it("should delete a product permanently", async () => {
    // Create a test product
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "A product for testing purposes",
        brand: "Test Brand",
        model: "Test Model",
        msrpPrice: 100.0,
        isSingleSize: true,
      },
    });

    const response = await request(app).delete(`/api/products/${product.id}`);

    expect(response.status).toBe(204);

    // Verify deletion
    const deletedProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it("should archive a product", async () => {
    // Create a test product
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "A product for testing purposes",
        brand: "Test Brand",
        model: "Test Model",
        msrpPrice: 100.0,
        isSingleSize: true,
      },
    });

    const response = await request(app).post(
      `/api/products/${product.id}/archive`
    );

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(true);

    // Clean up
    await prisma.product.delete({ where: { id: product.id } });
  });

  it("should unarchive a product", async () => {
    // Create a test product
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "A product for testing purposes",
        brand: "Test Brand",
        model: "Test Model",
        msrpPrice: 100.0,
        isSingleSize: true,
        archived: true,
      },
    });

    const response = await request(app).post(
      `/api/products/${product.id}/unarchive`
    );

    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(false);

    // Clean up
    await prisma.product.delete({ where: { id: product.id } });
  });
});
