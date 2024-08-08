import request from "supertest";
import app from "../../backend/src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Sale Controller", () => {
  let saleId: number;
  let productId: number;
  let variantId: number;
  let promoCodeId: number;

  beforeAll(async () => {
    await prisma.product.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.promoCode.deleteMany({});
    await prisma.sale.deleteMany({});
  });

  beforeEach(async () => {
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

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant",
        msrpPrice: 50,
        quantity: 5,
      },
    });

    const sale = await prisma.sale.create({
      data: {
        title: "Test Sale",
        tagline: "Test Tagline",
        startDate: new Date(),
        endDate: new Date(),
        products: { connect: { id: product.id } },
        variants: { connect: { id: variant.id } },
      },
    });

    const promoCode = await prisma.promoCode.create({
      data: {
        code: `TESTPROMO-${Date.now()}`, // Ensuring unique promo code
        validFrom: new Date(),
        validTo: new Date(),
        saleId: sale.id,
      },
    });

    productId = product.id;
    variantId = variant.id;
    saleId = sale.id;
    promoCodeId = promoCode.id;
  });

  afterAll(async () => {
    await prisma.sale.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.promoCode.deleteMany({});
    await prisma.$disconnect();
  });

  it("should create a new sale", async () => {
    const response = await request(app)
      .post("/api/sales")
      .send({
        name: "New Sale",
        title: "New Sale Title",
        tagline: "New Sale Tagline",
        startDate: new Date(),
        endDate: new Date(),
        salePercentage: 10,
        saleAmount: 15,
        products: [productId],
        variants: [variantId],
        promoCodes: [promoCodeId],
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("New Sale Title");
  });

  it("should get all sales", async () => {
    const response = await request(app).get("/api/sales");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a sale by ID", async () => {
    const response = await request(app).get(`/api/sales/${saleId}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Test Sale");
  });

  it("should update a sale", async () => {
    const response = await request(app).put(`/api/sales/${saleId}`).send({
      title: "Updated Sale Title",
      tagline: "Updated Sale Tagline",
    });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Sale Title");
  });

  it("should delete a sale", async () => {
    const response = await request(app).delete(`/api/sales/${saleId}`);

    expect(response.status).toBe(204);
  });

  describe("Archiving and Unarchiving", () => {
    beforeEach(async () => {
      const product = await prisma.product.create({
        data: {
          name: "Archive Product",
          description: "Archive Description",
          msrpPrice: 100,
          currentPrice: 90,
          brand: "Archive Brand",
          model: "Archive Model",
          quantity: 10,
        },
      });

      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: "Archive Variant",
          msrpPrice: 50,
          quantity: 5,
        },
      });

      const sale = await prisma.sale.create({
        data: {
          title: "Archive Sale",
          tagline: "Archive Tagline",
          startDate: new Date(),
          endDate: new Date(),
          products: { connect: { id: product.id } },
          variants: { connect: { id: variant.id } },
        },
      });

      saleId = sale.id;
    });

    it("should archive a sale", async () => {
      const response = await request(app).put(`/api/sales/archive/${saleId}`);

      expect(response.status).toBe(200);
      expect(response.body.archived).toBe(true);
    });

    it("should unarchive a sale", async () => {
      await request(app).put(`/api/sales/archive/${saleId}`);
      const response = await request(app).put(`/api/sales/unarchive/${saleId}`);

      expect(response.status).toBe(200);
      expect(response.body.archived).toBe(false);
    });
  });

  it("should return 404 for non-existent sale by ID", async () => {
    const response = await request(app).get("/api/sales/999999");

    expect(response.status).toBe(404);
  });

  it("should return 404 when updating a non-existent sale", async () => {
    const response = await request(app).put("/api/sales/999999").send({
      title: "Non-existent Sale",
      tagline: "Non-existent Sale Tagline",
    });

    expect(response.status).toBe(404);
  });

  it("should return 404 when archiving a non-existent sale", async () => {
    const response = await request(app).put("/api/sales/archive/999999");

    expect(response.status).toBe(404);
  });

  it("should return 404 when unarchiving a non-existent sale", async () => {
    const response = await request(app).put("/api/sales/unarchive/999999");

    expect(response.status).toBe(404);
  });

  it("should return 404 when deleting a non-existent sale", async () => {
    const response = await request(app).delete("/api/sales/999999");

    expect(response.status).toBe(404);
  });
});
