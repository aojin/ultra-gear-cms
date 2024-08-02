const request = require("supertest");
const app = require("../../app");
const prisma = require("../../prisma/prismaClient");

describe("CartItem API Tests", () => {
  let userId, cartId, productId, variantId, sizeId, cartItemId;

  beforeAll(async () => {
    try {
      // Create a user
      const user = await prisma.user.create({
        data: {
          name: "Test User",
          email: `testuser-${Date.now()}@example.com`,
          password: "securepassword123",
        },
      });
      userId = user.id;

      // Create a product
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

      // Create a product variant
      const variant = await prisma.productVariant.create({
        data: {
          name: "Test Variant",
          msrpPrice: 100.0,
          currentPrice: 80.0,
          productId: productId,
        },
      });
      variantId = variant.id;

      // Create a size
      const size = await prisma.size.create({
        data: {
          size: "M",
          quantity: 10,
          productId: productId,
          variantId: variantId,
        },
      });
      sizeId = size.id;

      // Create a cart
      const cart = await prisma.cart.create({
        data: {
          userId: userId,
          items: {
            create: {
              productId: productId,
              variantId: variantId,
              sizeId: sizeId,
              cartQuantity: 1,
              currentPrice: 80.0,
            },
          },
        },
      });
      cartId = cart.id;

      // Create a cart item
      const cartItem = await prisma.cartItem.create({
        data: {
          cartId: cartId,
          productId: productId,
          variantId: variantId,
          sizeId: sizeId,
          cartQuantity: 1,
          currentPrice: 80.0,
        },
      });
      cartItemId = cartItem.id;
    } catch (error) {
      console.error("Error during setup:", error);
    }
  });

  afterAll(async () => {
    try {
      if (cartItemId) {
        await prisma.cartItem.delete({ where: { id: cartItemId } });
      }
      if (cartId) {
        await prisma.cart.delete({ where: { id: cartId } });
      }
      if (sizeId) {
        await prisma.size.delete({ where: { id: sizeId } });
      }
      if (variantId) {
        await prisma.productVariant.delete({ where: { id: variantId } });
      }
      if (productId) {
        await prisma.product.delete({ where: { id: productId } });
      }
      if (userId) {
        await prisma.user.delete({ where: { id: userId } });
      }
      await prisma.$disconnect();
    } catch (error) {
      console.error("Error during teardown:", error);
    }
  });

  it("should create a new CartItem", async () => {
    const res = await request(app).post("/api/cart-items").send({
      cartId: cartId,
      productId: productId,
      variantId: variantId,
      sizeId: sizeId,
      cartQuantity: 2,
      currentPrice: 80.0,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should update a CartItem", async () => {
    const res = await request(app).put(`/api/cart-items/${cartItemId}`).send({
      cartQuantity: 3,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.cartQuantity).toBe(3);
  });

  it("should delete a CartItem", async () => {
    const res = await request(app).delete(`/api/cart-items/${cartItemId}`);
    expect(res.statusCode).toEqual(204);

    // Verify deletion
    const deletedRes = await request(app).get(`/api/cart-items/${cartItemId}`);
    expect(deletedRes.statusCode).toBe(404);
  });
});
