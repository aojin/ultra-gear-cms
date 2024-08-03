import request from "supertest";
import app from "../../backend/src/app.js";
import { PrismaClient } from "@prisma/client";
import resetDatabase from "../resetDatabase.js";
import { expect } from "chai";

const prisma = new PrismaClient();

describe("Product Integration Tests", () => {
  // Cleanup the test database before running the tests
  before(async () => {
    await resetDatabase();
  });

  after(async () => {
    await prisma.$disconnect();
  });

  it("should create a product", async () => {
    const response = await request(app).post("/api/products").send({
      name: "Test Product",
      description: "A test product",
      msrpPrice: 99.99,
      currentPrice: 89.99,
      brand: "Test Brand",
      model: "Model X",
    });

    // Assert that the response status is 201 Created
    expect(response.status).to.equal(201);
    // Additional assertions to verify the response
  });

  it("should get all products", (done) => {
    request(app)
      .get("/api/products")
      .expect(200)
      .expect((res) => {
        if (!Array.isArray(res.body))
          throw new Error("Response is not an array");
      })
      .end(done);
  });

  it("should get a product by ID", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product 2",
        description: "This is another test product",
        msrpPrice: 150.0,
        currentPrice: 120.0,
        brand: "Another Test Brand",
        model: "Another Test Model",
      },
    });

    return request(app)
      .get(`/api/products/${product.id}`)
      .expect(200)
      .expect((res) => {
        if (res.body.id !== product.id) throw new Error("Product ID mismatch");
      });
  });

  it("should update a product", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product 3",
        description: "This is yet another test product",
        msrpPrice: 200.0,
        currentPrice: 180.0,
        brand: "Yet Another Test Brand",
        model: "Yet Another Test Model",
      },
    });

    return request(app)
      .put(`/api/products/${product.id}`)
      .send({
        name: "Updated Test Product 3",
        currentPrice: 170.0,
      })
      .expect(200)
      .expect((res) => {
        if (res.body.name !== "Updated Test Product 3")
          throw new Error("Product name not updated");
        if (res.body.currentPrice !== 170.0)
          throw new Error("Product price not updated");
      });
  });

  it("should delete a product permanently", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product 4",
        description: "This is a test product to be deleted",
        msrpPrice: 300.0,
        currentPrice: 250.0,
        brand: "Delete Test Brand",
        model: "Delete Test Model",
      },
    });

    return request(app).delete(`/api/products/${product.id}`).expect(204);
  });

  it("should archive a product", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product 5",
        description: "This is a test product to be archived",
        msrpPrice: 350.0,
        currentPrice: 300.0,
        brand: "Archive Test Brand",
        model: "Archive Test Model",
      },
    });

    return request(app)
      .post(`/api/products/${product.id}/archive`)
      .expect(200)
      .expect((res) => {
        if (!res.body.archived) throw new Error("Product not archived");
      });
  });

  it("should unarchive a product", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product 6",
        description: "This is a test product to be unarchived",
        msrpPrice: 400.0,
        currentPrice: 350.0,
        brand: "Unarchive Test Brand",
        model: "Unarchive Test Model",
        archived: true,
      },
    });

    return request(app)
      .post(`/api/products/${product.id}/unarchive`)
      .expect(200)
      .expect((res) => {
        if (res.body.archived) throw new Error("Product not unarchived");
      });
  });
});
