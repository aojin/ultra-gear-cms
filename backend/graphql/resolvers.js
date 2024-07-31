const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const calculateCurrentPrice = async (productId, productVariantId) => {
  const sales = await prisma.sale.findMany({
    where: {
      OR: [
        { products: { some: { id: productId } } },
        { variants: { some: { id: productVariantId } } },
      ],
      archived: false,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    },
    include: { promoCodes: true },
  });

  let bestSale = null;
  let bestDiscount = 0;

  sales.forEach((sale) => {
    const discount = sale.salePercentage
      ? sale.salePercentage / 100
      : sale.saleAmount;
    if (discount > bestDiscount) {
      bestDiscount = discount;
      bestSale = sale;
    }
  });

  if (!bestSale) return null;

  let msrpPrice = productVariantId
    ? (
        await prisma.productVariant.findUnique({
          where: { id: productVariantId },
        })
      ).msrpPrice
    : (await prisma.product.findUnique({ where: { id: productId } })).msrpPrice;

  const currentPrice = bestSale.salePercentage
    ? msrpPrice * (1 - bestSale.salePercentage / 100)
    : msrpPrice - bestSale.saleAmount;

  return Math.max(currentPrice, 0);
};

const resolvers = {
  Query: {
    products: async () => {
      return await prisma.product.findMany();
    },
    product: async (_, args) => {
      return await prisma.product.findUnique({
        where: { id: Number(args.id) },
        include: {
          images: true,
          variants: true,
          reviews: true,
          inventory: true,
          sales: true,
          categories: true,
          subcategories: true,
          sizes: true,
        },
      });
    },
    categories: async () => {
      return await prisma.category.findMany({
        include: {
          subcategories: true,
          products: true,
        },
      });
    },
    category: async (_, args) => {
      return await prisma.category.findUnique({
        where: { id: Number(args.id) },
        include: {
          subcategories: true,
          products: true,
        },
      });
    },
    users: async () => {
      return await prisma.user.findMany();
    },
    user: async (_, args) => {
      return await prisma.user.findUnique({
        where: { id: Number(args.id) },
        include: {
          orders: true,
          reviews: true,
          cart: {
            include: {
              items: true,
            },
          },
        },
      });
    },
    orders: async () => {
      return await prisma.order.findMany();
    },
    order: async (_, args) => {
      return await prisma.order.findUnique({
        where: { id: Number(args.id) },
        include: {
          orderItems: true,
          user: true,
        },
      });
    },
  },
  Mutation: {
    createProduct: async (_, args) => {
      const { imageUrls, categoryIds, ...data } = args;
      const product = await prisma.product.create({
        data: {
          ...data,
          images: {
            create: imageUrls.map((url, index) => ({ url, order: index })),
          },
          categories: {
            connect: categoryIds.map((id) => ({ id: Number(id) })),
          },
        },
        include: {
          images: true,
          categories: true,
        },
      });
      return product;
    },
    updateProduct: async (_, args) => {
      const { id, imageUrls, categoryIds, ...data } = args;
      const product = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          ...data,
          images: {
            deleteMany: {},
            create: imageUrls.map((url, index) => ({ url, order: index })),
          },
          categories: {
            set: categoryIds.map((id) => ({ id: Number(id) })),
          },
        },
        include: {
          images: true,
          categories: true,
        },
      });
      return product;
    },
    deleteProduct: async (_, args) => {
      return await prisma.product.delete({
        where: { id: Number(args.id) },
      });
    },
    createProductVariant: async (_, args) => {
      const { imageUrls, ...data } = args;
      const productVariant = await prisma.productVariant.create({
        data: {
          ...data,
          images: {
            create: imageUrls.map((url, index) => ({ url, order: index })),
          },
        },
        include: {
          images: true,
        },
      });
      return productVariant;
    },
    updateProductVariant: async (_, args) => {
      const { id, imageUrls, ...data } = args;
      const productVariant = await prisma.productVariant.update({
        where: { id: Number(id) },
        data: {
          ...data,
          images: {
            deleteMany: {},
            create: imageUrls.map((url, index) => ({ url, order: index })),
          },
        },
        include: {
          images: true,
        },
      });
      return productVariant;
    },
    deleteProductVariant: async (_, args) => {
      return await prisma.productVariant.delete({
        where: { id: Number(args.id) },
      });
    },
    createCategory: async (_, args) => {
      return await prisma.category.create({
        data: {
          name: args.name,
          description: args.description,
        },
      });
    },
    updateCategory: async (_, args) => {
      return await prisma.category.update({
        where: { id: Number(args.id) },
        data: {
          name: args.name,
          description: args.description,
        },
      });
    },
    deleteCategory: async (_, args) => {
      return await prisma.category.delete({
        where: { id: Number(args.id) },
      });
    },
    createSubCategory: async (_, args) => {
      return await prisma.subCategory.create({
        data: {
          name: args.name,
          description: args.description,
          category: {
            connect: { id: Number(args.categoryId) },
          },
        },
      });
    },
    updateSubCategory: async (_, args) => {
      return await prisma.subCategory.update({
        where: { id: Number(args.id) },
        data: {
          name: args.name,
          description: args.description,
          category: {
            connect: { id: Number(args.categoryId) },
          },
        },
      });
    },
    deleteSubCategory: async (_, args) => {
      return await prisma.subCategory.delete({
        where: { id: Number(args.id) },
      });
    },
    createUser: async (_, args) => {
      return await prisma.user.create({
        data: {
          email: args.email,
          password: args.password,
          name: args.name,
        },
      });
    },
    updateUser: async (_, args) => {
      return await prisma.user.update({
        where: { id: Number(args.id) },
        data: {
          email: args.email,
          password: args.password,
          name: args.name,
        },
      });
    },
    deleteUser: async (_, args) => {
      return await prisma.user.delete({
        where: { id: Number(args.id) },
      });
    },
    createOrder: async (_, args) => {
      return await prisma.order.create({
        data: {
          user: {
            connect: { id: Number(args.userId) },
          },
          totalAmount: args.totalAmount,
        },
      });
    },
    updateOrder: async (_, args) => {
      return await prisma.order.update({
        where: { id: Number(args.id) },
        data: {
          totalAmount: args.totalAmount,
        },
      });
    },
    deleteOrder: async (_, args) => {
      return await prisma.order.delete({
        where: { id: Number(args.id) },
      });
    },
    createReview: async (_, args) => {
      return await prisma.review.create({
        data: {
          user: {
            connect: { id: Number(args.userId) },
          },
          product: {
            connect: { id: Number(args.productId) },
          },
          rating: args.rating,
          comment: args.comment,
        },
      });
    },
    updateReview: async (_, args) => {
      return await prisma.review.update({
        where: { id: Number(args.id) },
        data: {
          rating: args.rating,
          comment: args.comment,
        },
      });
    },
    deleteReview: async (_, args) => {
      return await prisma.review.delete({
        where: { id: Number(args.id) },
      });
    },
    createCartItem: async (_, args) => {
      return await prisma.cartItem.create({
        data: {
          cart: {
            connect: { id: Number(args.cartId) },
          },
          product: {
            connect: { id: Number(args.productId) },
          },
          quantity: args.quantity,
          size: args.sizeId
            ? { connect: { id: Number(args.sizeId) } }
            : undefined,
          variant: args.variantId
            ? { connect: { id: Number(args.variantId) } }
            : undefined,
          currentPrice: args.currentPrice,
        },
      });
    },
    updateCartItem: async (_, args) => {
      return await prisma.cartItem.update({
        where: { id: Number(args.id) },
        data: {
          quantity: args.quantity,
        },
      });
    },
    deleteCartItem: async (_, args) => {
      return await prisma.cartItem.delete({
        where: { id: Number(args.id) },
      });
    },
    createInventory: async (_, args) => {
      return await prisma.inventory.create({
        data: {
          product: args.productId
            ? { connect: { id: Number(args.productId) } }
            : undefined,
          variant: args.variantId
            ? { connect: { id: Number(args.variantId) } }
            : undefined,
          quantity: args.quantity,
        },
      });
    },
    updateInventory: async (_, args) => {
      return await prisma.inventory.update({
        where: { id: Number(args.id) },
        data: {
          quantity: args.quantity,
        },
      });
    },
    deleteInventory: async (_, args) => {
      return await prisma.inventory.delete({
        where: { id: Number(args.id) },
      });
    },
    createSale: async (_, args) => {
      return await prisma.sale.create({
        data: {
          name: args.name,
          title: args.title,
          tagline: args.tagline,
          startDate: args.startDate,
          endDate: args.endDate,
          salePercentage: args.salePercentage,
          saleAmount: args.saleAmount,
        },
      });
    },
    updateSale: async (_, args) => {
      return await prisma.sale.update({
        where: { id: Number(args.id) },
        data: {
          name: args.name,
          title: args.title,
          tagline: args.tagline,
          startDate: args.startDate,
          endDate: args.endDate,
          salePercentage: args.salePercentage,
          saleAmount: args.saleAmount,
        },
      });
    },
    deleteSale: async (_, args) => {
      return await prisma.sale.delete({
        where: { id: Number(args.id) },
      });
    },
    createPromoCode: async (_, args) => {
      return await prisma.promoCode.create({
        data: {
          code: args.code,
          validFrom: args.validFrom,
          validTo: args.validTo,
          sale: {
            connect: { id: Number(args.saleId) },
          },
        },
      });
    },
    updatePromoCode: async (_, args) => {
      return await prisma.promoCode.update({
        where: { id: Number(args.id) },
        data: {
          code: args.code,
          validFrom: args.validFrom,
          validTo: args.validTo,
        },
      });
    },
    deletePromoCode: async (_, args) => {
      return await prisma.promoCode.delete({
        where: { id: Number(args.id) },
      });
    },
    createPackage: async (_, args) => {
      return await prisma.package.create({
        data: {
          name: args.name,
          description: args.description,
          price: args.price,
          products: {
            connect: args.products.map((id) => ({ id: Number(id) })),
          },
        },
      });
    },
    updatePackage: async (_, args) => {
      return await prisma.package.update({
        where: { id: Number(args.id) },
        data: {
          name: args.name,
          description: args.description,
          price: args.price,
          products: {
            set: args.products.map((id) => ({ id: Number(id) })),
          },
        },
      });
    },
    deletePackage: async (_, args) => {
      return await prisma.package.delete({
        where: { id: Number(args.id) },
      });
    },
  },
  Product: {
    currentPrice: async (parent) => {
      return await calculateCurrentPrice(parent.id, null);
    },
    images: async (parent) => {
      return await prisma.productImage.findMany({
        where: { productId: parent.id },
      });
    },
    variants: async (parent) => {
      return await prisma.productVariant.findMany({
        where: { productId: parent.id },
      });
    },
    reviews: async (parent) => {
      return await prisma.review.findMany({
        where: { productId: parent.id },
      });
    },
    inventory: async (parent) => {
      return await prisma.inventory.findMany({
        where: { productId: parent.id },
      });
    },
    sales: async (parent) => {
      return await prisma.sale.findMany({
        where: { products: { some: { id: parent.id } } },
      });
    },
    categories: async (parent) => {
      return await prisma.category.findMany({
        where: { products: { some: { id: parent.id } } },
      });
    },
    subcategories: async (parent) => {
      return await prisma.subCategory.findMany({
        where: { products: { some: { id: parent.id } } },
      });
    },
    sizes: async (parent) => {
      return await prisma.size.findMany({
        where: { productId: parent.id },
      });
    },
  },
  ProductVariant: {
    currentPrice: async (parent) => {
      return await calculateCurrentPrice(null, parent.id);
    },
    images: async (parent) => {
      return await prisma.productImage.findMany({
        where: { productVariantId: parent.id },
      });
    },
    sales: async (parent) => {
      return await prisma.sale.findMany({
        where: { variants: { some: { id: parent.id } } },
      });
    },
    sizes: async (parent) => {
      return await prisma.size.findMany({
        where: { variantId: parent.id },
      });
    },
  },
  User: {
    orders: async (parent) => {
      return await prisma.order.findMany({
        where: { userId: parent.id },
      });
    },
    reviews: async (parent) => {
      return await prisma.review.findMany({
        where: { userId: parent.id },
      });
    },
    cart: async (parent) => {
      return await prisma.cart.findUnique({
        where: { userId: parent.id },
      });
    },
  },
  Order: {
    user: async (parent) => {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    orderItems: async (parent) => {
      return await prisma.orderItem.findMany({
        where: { orderId: parent.id },
      });
    },
  },
  OrderItem: {
    order: async (parent) => {
      return await prisma.order.findUnique({
        where: { id: parent.orderId },
      });
    },
    product: async (parent) => {
      return await prisma.product.findUnique({
        where: { id: parent.productId },
      });
    },
    variant: async (parent) => {
      return await prisma.productVariant.findUnique({
        where: { id: parent.variantId },
      });
    },
  },
  Review: {
    user: async (parent) => {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    product: async (parent) => {
      return await prisma.product.findUnique({
        where: { id: parent.productId },
      });
    },
  },
  Cart: {
    user: async (parent) => {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    items: async (parent) => {
      return await prisma.cartItem.findMany({
        where: { cartId: parent.id },
      });
    },
  },
  CartItem: {
    cart: async (parent) => {
      return await prisma.cart.findUnique({
        where: { id: parent.cartId },
      });
    },
    product: async (parent) => {
      return await prisma.product.findUnique({
        where: { id: parent.productId },
      });
    },
    size: async (parent) => {
      return await prisma.size.findUnique({
        where: { id: parent.sizeId },
      });
    },
    variant: async (parent) => {
      return await prisma.productVariant.findUnique({
        where: { id: parent.variantId },
      });
    },
  },
  Inventory: {
    product: async (parent) => {
      return await prisma.product.findUnique({
        where: { id: parent.productId },
      });
    },
    variant: async (parent) => {
      return await prisma.productVariant.findUnique({
        where: { id: parent.variantId },
      });
    },
  },
  Sale: {
    products: async (parent) => {
      return await prisma.product.findMany({
        where: { sales: { some: { id: parent.id } } },
      });
    },
    variants: async (parent) => {
      return await prisma.productVariant.findMany({
        where: { sales: { some: { id: parent.id } } },
      });
    },
    promoCodes: async (parent) => {
      return await prisma.promoCode.findMany({
        where: { saleId: parent.id },
      });
    },
  },
  PromoCode: {
    sale: async (parent) => {
      return await prisma.sale.findUnique({
        where: { id: parent.saleId },
      });
    },
  },
  Package: {
    products: async (parent) => {
      return await prisma.product.findMany({
        where: { packages: { some: { id: parent.id } } },
      });
    },
  },
};

module.exports = resolvers;
