const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const app = require("../../app");
const prisma = new PrismaClient();

let saleId, promoCodeId;

beforeAll(async () => {
  // Create a sale for testing
  const sale = await prisma.sale.create({
    data: {
      name: "Test Sale",
      saleAmount: 10.0,
      title: "Test Sale Title",
      tagline: "Test Tagline",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });
  saleId = sale.id;
});

afterAll(async () => {
  // Cleanup
  if (promoCodeId) {
    await prisma.promoCode.delete({ where: { id: promoCodeId } });
  }
  if (saleId) {
    await prisma.sale.delete({ where: { id: saleId } });
  }
  await prisma.$disconnect();
});

describe("PromoCode API Tests", () => {
  it("should create a new PromoCode", async () => {
    const sale = await prisma.sale.findUnique({ where: { id: saleId } });
    const res = await request(app).post("/api/promo-codes").send({
      code: "PROMO123",
      validFrom: sale.startDate,
      validTo: sale.endDate,
      saleId: saleId,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    promoCodeId = res.body.id; // Save promoCodeId for further tests
  });

  it("should retrieve all PromoCodes", async () => {
    const res = await request(app).get("/api/promo-codes");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should retrieve a PromoCode by ID", async () => {
    const res = await request(app).get(`/api/promo-codes/${promoCodeId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toEqual(promoCodeId);
  });

  it("should update a PromoCode", async () => {
    const res = await request(app)
      .put(`/api/promo-codes/${promoCodeId}`)
      .send({
        code: "UPDATEDPROMO",
        validFrom: new Date(),
        validTo: new Date(new Date().setMonth(new Date().getMonth() + 2)),
        saleId: saleId,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("code");
    expect(res.body.code).toEqual("UPDATEDPROMO");
  });

  it("should delete a PromoCode", async () => {
    const res = await request(app).delete(`/api/promo-codes/${promoCodeId}`);

    expect(res.statusCode).toEqual(204); // Expecting 204 for successful deletion

    // Optionally verify response body or ensure no response body
    expect(res.body).toEqual({});

    // Clear promoCodeId if deletion is successful
    promoCodeId = null; // Set promoCodeId to null to avoid further cleanup attempts
  });
});
