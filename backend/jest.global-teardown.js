const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  // Delete all data from tables
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.promoCode.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.size.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.subCategory.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.user.deleteMany({});

  // Disconnect Prisma after all tests are done
  await prisma.$disconnect();
};
