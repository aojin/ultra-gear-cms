import request from "supertest";
import app from "../../backend/src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Promo Code Controller", () => {
  let saleId: number;
  let promoCodeId: number;

  beforeAll(async () => {
    // Clean up test database
    await prisma.promoCode.deleteMany({});
    await prisma.sale.deleteMany({});

    // Create test sale
    const sale = await prisma.sale.create({
      data: {
        title: "Test Sale",
        tagline: "Test Tagline",
        salePercentage: 20,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
      },
    });

    saleId = sale.id;
  });

  afterAll(async () => {
    // Clean up test database
    await prisma.promoCode.deleteMany({});
    await prisma.sale.deleteMany({});
    await prisma.$disconnect();
  });

  it("should create a new promo code", async () => {
    const response = await request(app)
      .post("/api/promo-codes")
      .send({
        code: "TESTCODE",
        validFrom: new Date(),
        validTo: new Date(new Date().setDate(new Date().getDate() + 5)),
        saleId,
      });

    expect(response.status).toBe(201);
    expect(response.body.code).toBe("TESTCODE");
    promoCodeId = response.body.id;
  });

  it("should get all promo codes", async () => {
    const response = await request(app).get("/api/promo-codes");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a promo code by ID", async () => {
    const response = await request(app).get(`/api/promo-codes/${promoCodeId}`);

    expect(response.status).toBe(200);
    expect(response.body.code).toBe("TESTCODE");
  });

  it("should update a promo code", async () => {
    const response = await request(app)
      .put(`/api/promo-codes/${promoCodeId}`)
      .send({
        code: "UPDATEDCODE",
        validFrom: new Date(),
        validTo: new Date(new Date().setDate(new Date().getDate() + 10)),
      });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe("UPDATEDCODE");
  });

  it("should delete a promo code", async () => {
    const response = await request(app).delete(
      `/api/promo-codes/${promoCodeId}`
    );

    expect(response.status).toBe(204);
  });

  it("should return 404 for non-existent promo code by ID", async () => {
    const response = await request(app).get("/api/promo-codes/999999");

    expect(response.status).toBe(404);
  });

  it("should return 404 when updating a non-existent promo code", async () => {
    const response = await request(app)
      .put("/api/promo-codes/999999")
      .send({
        code: "NONEXISTENT",
        validFrom: new Date(),
        validTo: new Date(new Date().setDate(new Date().getDate() + 10)),
      });

    expect(response.status).toBe(404);
  });

  it("should return 404 when deleting a non-existent promo code", async () => {
    const response = await request(app).delete("/api/promo-codes/999999");

    expect(response.status).toBe(404);
  });
});
