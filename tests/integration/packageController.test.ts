import request from "supertest";
import app from "../../backend/src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Package Controller", () => {
  let packageId: number;
  let product1Id: number;
  let product2Id: number;

  beforeAll(async () => {
    // Clean up test database
    await prisma.package.deleteMany({});
    await prisma.product.deleteMany({});

    // Create test data
    const product1 = await prisma.product.create({
      data: {
        name: "Product 1",
        description: "Description 1",
        msrpPrice: 100,
        currentPrice: 90,
        brand: "Brand 1",
        model: "Model 1",
        quantity: 10,
      },
    });

    const product2 = await prisma.product.create({
      data: {
        name: "Product 2",
        description: "Description 2",
        msrpPrice: 200,
        currentPrice: 180,
        brand: "Brand 2",
        model: "Model 2",
        quantity: 5,
      },
    });

    product1Id = product1.id;
    product2Id = product2.id;

    // Create a package
    const newPackage = await prisma.package.create({
      data: {
        name: "Test Package",
        description: "Test Description",
        price: 250,
        products: {
          connect: [{ id: product1Id }, { id: product2Id }],
        },
      },
    });

    packageId = newPackage.id;

    // Verify the package is created
    const createdPackage = await prisma.package.findUnique({
      where: { id: packageId },
      include: { products: true },
    });

    if (!createdPackage) {
      throw new Error("Package creation failed");
    }
  });

  afterEach(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });

  afterAll(async () => {
    // Clean up test database
    await prisma.package.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.$disconnect();
  });

  it("should create a new package", async () => {
    const response = await request(app)
      .post("/api/packages")
      .send({
        name: "New Package",
        description: "New Description",
        price: 300,
        products: [product1Id, product2Id],
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("New Package");
    expect(response.body.price).toBe(300);
  });

  it("should get all packages", async () => {
    const response = await request(app).get("/api/packages");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a package by ID", async () => {
    const response = await request(app).get(`/api/packages/${packageId}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test Package");
  });

  it("should return 404 for non-existent package by ID", async () => {
    const response = await request(app).get("/api/packages/999999");

    expect(response.status).toBe(404);
  });

  it("should update a package", async () => {
    const response = await request(app)
      .put(`/api/packages/${packageId}`)
      .send({
        name: "Updated Package",
        description: "Updated Description",
        price: 350,
        products: [product1Id, product2Id],
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Package");
    expect(response.body.price).toBe(350);
  });

  it("should return 404 when updating a non-existent package", async () => {
    const response = await request(app)
      .put("/api/packages/999999")
      .send({
        name: "Non-existent Package",
        description: "Non-existent Description",
        price: 350,
        products: [product1Id, product2Id],
      });

    expect(response.status).toBe(404);
  });

  it("should delete a package", async () => {
    const response = await request(app).delete(`/api/packages/${packageId}`);

    expect(response.status).toBe(204);
  });

  it("should return 404 when deleting a non-existent package", async () => {
    const response = await request(app).delete("/api/packages/999999");

    expect(response.status).toBe(404);
  });
});
