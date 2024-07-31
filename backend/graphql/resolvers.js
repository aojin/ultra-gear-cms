const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    products: async () => {
      const products = await prisma.product.findMany({
        include: {
          images: true,
          variants: {
            include: {
              images: true,
            },
          },
        },
      });

      const activePackages = await prisma.package.findMany({
        where: { archived: false },
        include: {
          products: true,
        },
      });

      const productPackageVariantsMap = {};

      activePackages.forEach((pkg) => {
        pkg.products.forEach((product) => {
          if (!productPackageVariantsMap[product.id]) {
            productPackageVariantsMap[product.id] = [];
          }
          productPackageVariantsMap[product.id].push({
            id: `package-${pkg.id}`,
            name: `Package: ${pkg.name}`,
            msrpPrice: pkg.price,
            currentPrice: pkg.salePrice || pkg.price,
            productId: product.id,
            product,
            isSingleSize: true,
            quantity: null,
            sizes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            archived: false,
            images: [],
            sales: [],
            stockStatus: "IN_STOCK",
          });
        });
      });

      products.forEach((product) => {
        if (productPackageVariantsMap[product.id]) {
          product.variants.push(...productPackageVariantsMap[product.id]);
        }
      });

      return products;
    },
    product: async (_, args) => {
      const product = await prisma.product.findUnique({
        where: { id: Number(args.id) },
        include: {
          images: true,
          variants: {
            include: {
              images: true,
            },
          },
        },
      });

      const activePackages = await prisma.package.findMany({
        where: {
          archived: false,
          products: {
            some: {
              id: product.id,
            },
          },
        },
      });

      const packageVariants = activePackages.map((pkg) => ({
        id: `package-${pkg.id}`,
        name: `Package: ${pkg.name}`,
        msrpPrice: pkg.price,
        currentPrice: pkg.salePrice || pkg.price,
        productId: product.id,
        product,
        isSingleSize: true,
        quantity: null,
        sizes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        archived: false,
        images: [],
        sales: [],
        stockStatus: "IN_STOCK",
      }));

      product.variants.push(...packageVariants);

      return product;
    },
    categories: async () => {
      return await prisma.category.findMany({
        include: {
          subcategories: true,
        },
      });
    },
    category: async (_, args) => {
      return await prisma.category.findUnique({
        where: { id: Number(args.id) },
        include: {
          products: true,
          subcategories: true,
        },
      });
    },
    users: async () => {
      return await prisma.user.findMany();
    },
    user: async (_, args) => {
      return await prisma.user.findUnique({
        where: { id: Number(args.id) },
      });
    },
    orders: async () => {
      return await prisma.order.findMany();
    },
    order: async (_, args) => {
      return await prisma.order.findUnique({
        where: { id: Number(args.id) },
      });
    },
  },
  Mutation: {
    createProduct: async (_, args) => {
      const product = await prisma.product.create({
        data: {
          name: args.name,
          description: args.description,
          msrpPrice: args.msrpPrice,
          brand: args.brand,
          model: args.model,
          images: {
            create: args.imageUrls.map((url, index) => ({ url, order: index })),
          },
          categories: {
            connect: args.categoryIds.map((id) => ({ id: Number(id) })),
          },
        },
        include: {
          images: true,
        },
      });
      return product;
    },
    updateProduct: async (_, args) => {
      const product = await prisma.product.update({
        where: { id: Number(args.id) },
        data: {
          name: args.name,
          description: args.description,
          msrpPrice: args.msrpPrice,
          brand: args.brand,
          model: args.model,
          images: {
            deleteMany: {},
            create: args.imageUrls.map((url, index) => ({ url, order: index })),
          },
          categories: {
            set: [],
            connect: args.categoryIds.map((id) => ({ id: Number(id) })),
          },
        },
        include: {
          images: true,
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
      const productVariant = await prisma.productVariant.create({
        data: {
          productId: Number(args.productId),
          name: args.name,
          msrpPrice: args.msrpPrice,
          isSingleSize: args.isSingleSize,
          quantity: args.quantity,
          images: {
            create: args.imageUrls.map((url, index) => ({ url, order: index })),
          },
        },
        include: {
          images: true,
        },
      });
      return productVariant;
    },
    updateProductVariant: async (_, args) => {
      const productVariant = await prisma.productVariant.update({
        where: { id: Number(args.id) },
        data: {
          name: args.name,
          msrpPrice: args.msrpPrice,
          isSingleSize: args.isSingleSize,
          quantity: args.quantity,
          images: {
            deleteMany: {},
            create: args.imageUrls.map((url, index) => ({ url, order: index })),
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
      const category = await prisma.category.findUnique({
        where: { id: Number(args.id) },
        include: { products: true },
      });

      if (category.products.length > 0) {
        throw new Error("Category has products and cannot be deleted");
      }

      return await prisma.category.delete({
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
          userId: Number(args.userId),
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
          userId: Number(args.userId),
          productId: Number(args.productId),
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
          cartId: Number(args.cartId),
          productId: Number(args.productId),
          variantId: args.variantId ? Number(args.variantId) : null,
          sizeId: args.sizeId ? Number(args.sizeId) : null,
          cartQuantity: args.cartQuantity,
          currentPrice: args.currentPrice,
        },
      });
    },
    updateCartItem: async (_, args) => {
      return await prisma.cartItem.update({
        where: { id: Number(args.id) },
        data: {
          cartQuantity: args.cartQuantity,
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
          productId: args.productId ? Number(args.productId) : null,
          variantId: args.variantId ? Number(args.variantId) : null,
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
          saleId: Number(args.saleId),
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
            set: [],
            connect: args.products.map((id) => ({ id: Number(id) })),
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
    stockStatus: async (parent) => {
      if (parent.isSingleSize) {
        return parent.quantity > 5
          ? "IN_STOCK"
          : parent.quantity > 0
          ? "LOW_STOCK"
          : "OUT_OF_STOCK";
      } else {
        const totalQuantity = parent.sizes.reduce(
          (acc, size) => acc + size.quantity,
          0
        );
        return totalQuantity > 5
          ? "IN_STOCK"
          : totalQuantity > 0
          ? "LOW_STOCK"
          : "OUT_OF_STOCK";
      }
    },
  },
  ProductVariant: {
    stockStatus: async (parent) => {
      if (parent.isSingleSize) {
        return parent.quantity > 5
          ? "IN_STOCK"
          : parent.quantity > 0
          ? "LOW_STOCK"
          : "OUT_OF_STOCK";
      } else {
        const totalQuantity = parent.sizes.reduce(
          (acc, size) => acc + size.quantity,
          0
        );
        return totalQuantity > 5
          ? "IN_STOCK"
          : totalQuantity > 0
          ? "LOW_STOCK"
          : "OUT_OF_STOCK";
      }
    },
  },
};

module.exports = resolvers;
