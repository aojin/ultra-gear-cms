const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const app = require("../../app");

const prisma = new PrismaClient();

let productId, variantId, inventoryId;

beforeAll(async () => {
  try {
    // Create a product for testing
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Product Description",
        msrpPrice: 100.0,
        currentPrice: 80.0,
        brand: "Test Brand",
        model: "Test Model",
      },
    });
    productId = product.id;

    // Create a product variant for testing
    const variant = await prisma.productVariant.create({
      data: {
        name: "Test Variant",
        msrpPrice: 100.0,
        currentPrice: 80.0,
        productId: productId,
      },
    });
    variantId = variant.id;

    // Create inventory for testing
    const inventory = await prisma.inventory.create({
      data: {
        quantity: 50,
        product: {
          connect: { id: productId },
        },
      },
    });
    inventoryId = inventory.id;

    console.log(
      "Setup complete: productId:",
      productId,
      "variantId:",
      variantId,
      "inventoryId:",
      inventoryId
    );
  } catch (error) {
    console.error("Error during setup:", error);
  }
});

afterAll(async () => {
  try {
    // Cleanup
    if (inventoryId) {
      await prisma.inventory.delete({ where: { id: inventoryId } });
    }
    if (variantId) {
      await prisma.productVariant.delete({ where: { id: variantId } });
    }
    if (productId) {
      await prisma.product.delete({ where: { id: productId } });
    }
    await prisma.$disconnect();
  } catch (error) {
    console.error("Error during teardown:", error);
  }
});

describe("Inventory API Tests", () => {
  it("should create a new Inventory", async () => {
    const res = await request(app).post("/api/inventories").send({
      quantity: 30,
      productId: productId,
    });

    console.log("Create Inventory Response:", res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.quantity).toBe(30);
    inventoryId = res.body.id; // Save inventoryId for further tests
  });

  it("should get all Inventories", async () => {
    const res = await request(app).get("/api/inventories");

    console.log("Get All Inventories Response:", res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get a single Inventory", async () => {
    const res = await request(app).get(`/api/inventories/${inventoryId}`);

    console.log("Get Single Inventory Response:", res.body);
    if (res.statusCode !== 200) {
      console.error("Error fetching inventory:", res.body);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", inventoryId);
  });

  it("should update an Inventory", async () => {
    const res = await request(app).put(`/api/inventories/${inventoryId}`).send({
      quantity: 40,
    });

    console.log("Update Inventory Response:", res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(40);
  });

  it("should delete an Inventory", async () => {
    const res = await request(app).delete(`/api/inventories/${inventoryId}`);

    console.log("Delete Inventory Response:", res.body);
    expect(res.statusCode).toBe(204);

    // Verify deletion
    const deletedRes = await request(app).get(
      `/api/inventories/${inventoryId}`
    );
    expect(deletedRes.statusCode).toBe(404);
  });
});
