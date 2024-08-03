import request from "supertest";
import app from "../../backend/src/app.js";
import { PrismaClient } from "@prisma/client";
import resetDatabase from "../resetDatabase.js";

const prisma = new PrismaClient();

describe("Product Variant Integration Tests", () => {
  // Cleanup the test database before running the tests
  before(async () => {
    await resetDatabase();
    // Create a product to associate with product variants
    await prisma.product.create({
      data: {
        name: "Test Product",
        description: "This is a test product",
        msrpPrice: 100.0,
        currentPrice: 90.0,
        brand: "Test Brand",
        model: "Test Model",
      },
    });
  });

  after(async () => {
    await prisma.$disconnect();
  });

  it("should create a new product variant", (done) => {
    request(app)
      .post("/api/product-variants")
      .send({
        name: "Test Variant",
        msrpPrice: 100.0,
        currentPrice: 90.0,
        productId: 1, // Assuming a product with ID 1 exists in the test database
        isSingleSize: true,
      })
      .expect(201)
      .expect((res) => {
        if (!res.body.id) throw new Error("Missing product variant ID");
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("should get all product variants", (done) => {
    request(app)
      .get("/api/product-variants")
      .expect(200)
      .expect((res) => {
        if (!Array.isArray(res.body))
          throw new Error("Response is not an array");
      })
      .end(done);
  });

  it("should get a product variant by ID", async () => {
    const productVariant = await prisma.productVariant.create({
      data: {
        name: "Test Variant 2",
        msrpPrice: 150.0,
        currentPrice: 120.0,
        productId: 1, // Assuming a product with ID 1 exists in the test database
        isSingleSize: true,
      },
    });

    return request(app)
      .get(`/api/product-variants/${productVariant.id}`)
      .expect(200)
      .expect((res) => {
        if (res.body.id !== productVariant.id)
          throw new Error("Product variant ID mismatch");
      });
  });

  it("should update a product variant", async () => {
    const productVariant = await prisma.productVariant.create({
      data: {
        name: "Test Variant 3",
        msrpPrice: 200.0,
        currentPrice: 180.0,
        productId: 1, // Assuming a product with ID 1 exists in the test database
        isSingleSize: true,
      },
    });

    return request(app)
      .put(`/api/product-variants/${productVariant.id}`)
      .send({
        name: "Updated Test Variant 3",
        currentPrice: 170.0,
      })
      .expect(200)
      .expect((res) => {
        if (res.body.name !== "Updated Test Variant 3")
          throw new Error("Product variant name not updated");
        if (res.body.currentPrice !== 170.0)
          throw new Error("Product variant price not updated");
      });
  });

  it("should delete a product variant", async () => {
    const productVariant = await prisma.productVariant.create({
      data: {
        name: "Test Variant 4",
        msrpPrice: 300.0,
        currentPrice: 250.0,
        productId: 1, // Assuming a product with ID 1 exists in the test database
        isSingleSize: true,
      },
    });

    return request(app)
      .delete(`/api/product-variants/${productVariant.id}`)
      .expect(204);
  });

  it("should archive a product variant", async () => {
    const productVariant = await prisma.productVariant.create({
      data: {
        name: "Test Variant 5",
        msrpPrice: 350.0,
        currentPrice: 300.0,
        productId: 1, // Assuming a product with ID 1 exists in the test database
        isSingleSize: true,
      },
    });

    return request(app)
      .post(`/api/product-variants/${productVariant.id}/archive`)
      .expect(200)
      .expect((res) => {
        if (!res.body.archived) throw new Error("Product variant not archived");
      });
  });

  it("should unarchive a product variant", async () => {
    const productVariant = await prisma.productVariant.create({
      data: {
        name: "Test Variant 6",
        msrpPrice: 400.0,
        currentPrice: 350.0,
        productId: 1, // Assuming a product with ID 1 exists in the test database
        isSingleSize: true,
        archived: true,
      },
    });

    return request(app)
      .post(`/api/product-variants/${productVariant.id}/unarchive`)
      .expect(200)
      .expect((res) => {
        if (res.body.archived)
          throw new Error("Product variant not unarchived");
      });
  });
});
