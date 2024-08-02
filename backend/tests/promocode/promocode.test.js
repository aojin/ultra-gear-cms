const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("PromoCode Model Tests", () => {
  let promoCodeId;
  let saleId;

  beforeAll(async () => {
    let sale = await prisma.sale.findFirst({
      where: { name: "Test Sale" },
    });

    if (!sale) {
      sale = await prisma.sale.create({
        data: {
          name: "Test Sale",
          title: "Test Title",
          tagline: "Test Tagline",
          startDate: new Date(),
          endDate: new Date(),
        },
      });
    }

    saleId = sale.id;

    let promoCode = await prisma.promoCode.findFirst({
      where: { code: "TESTCODE" },
    });

    if (!promoCode) {
      promoCode = await prisma.promoCode.create({
        data: {
          code: "TESTCODE",
          validFrom: new Date(),
          validTo: new Date(new Date().setDate(new Date().getDate() + 30)),
          saleId: saleId,
        },
      });
    }

    promoCodeId = promoCode.id;
  });

  test("should create a PromoCode", async () => {
    const newPromoCode = await prisma.promoCode.create({
      data: {
        code: "NEWCODE",
        validFrom: new Date(),
        validTo: new Date(new Date().setDate(new Date().getDate() + 30)),
        saleId: saleId,
      },
    });
    expect(newPromoCode).toHaveProperty("id");
    await prisma.promoCode.delete({ where: { id: newPromoCode.id } }); // Clean up
  });

  test("should read a PromoCode", async () => {
    const promoCode = await prisma.promoCode.findUnique({
      where: { id: promoCodeId },
    });
    expect(promoCode).toHaveProperty("id");
  });

  test("should update a PromoCode", async () => {
    const promoCode = await prisma.promoCode.update({
      where: { id: promoCodeId },
      data: { code: "UPDATEDCODE" },
    });
    expect(promoCode.code).toBe("UPDATEDCODE");
  });

  test("should delete a PromoCode", async () => {
    await prisma.promoCode.delete({
      where: { id: promoCodeId },
    });
    const promoCode = await prisma.promoCode.findUnique({
      where: { id: promoCodeId },
    });
    expect(promoCode).toBeNull();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
