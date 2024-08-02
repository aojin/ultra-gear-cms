const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("ProductImage Model Tests", () => {
  let productImageId;

  beforeEach(async () => {
    const productImage = await prisma.productImage.create({
      data: {
        url: "http://example.com/image.png",
        order: 1,
      },
    });
    productImageId = productImage.id;
  });

  afterEach(async () => {
    await prisma.productImage.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a ProductImage", async () => {
    const productImage = await prisma.productImage.findUnique({
      where: { id: productImageId },
    });
    expect(productImage).toHaveProperty("id", productImageId);
  });

  it("should update a ProductImage", async () => {
    const updatedProductImage = await prisma.productImage.update({
      where: { id: productImageId },
      data: { url: "http://example.com/updated-image.png" },
    });
    expect(updatedProductImage).toHaveProperty(
      "url",
      "http://example.com/updated-image.png"
    );
  });

  it("should delete a ProductImage", async () => {
    await prisma.productImage.delete({
      where: { id: productImageId },
    });
    const productImage = await prisma.productImage.findUnique({
      where: { id: productImageId },
    });
    expect(productImage).toBeNull();
  });
});
