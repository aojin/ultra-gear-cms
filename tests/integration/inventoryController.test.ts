import request from "supertest";
import app from "../../backend/src/app"; // Adjust the path as necessary
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Inventory Controller", () => {
  beforeAll(async () => {
    await prisma.inventory.deleteMany();
    await prisma.size.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
  });

  afterEach(async () => {
    await prisma.$executeRaw`ROLLBACK`;
  });

  afterAll(async () => {
    await prisma.inventory.deleteMany();
    await prisma.size.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.$disconnect();
  });

  it("should create a new inventory", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Create Inventory",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant for Create Inventory",
        msrpPrice: 100,
        currentPrice: 80,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: "M",
        quantity: 50,
        productId: product.id,
        variantId: variant.id,
      },
    });

    const response = await request(app).post("/api/inventories").send({
      productId: product.id,
      variantId: variant.id,
      sizeId: size.id,
      quantity: 30,
    });

    expect(response.status).toBe(201);
    expect(response.body.quantity).toBe(30);
  });

  it("should get all inventories", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Get All Inventories",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant for Get All Inventories",
        msrpPrice: 100,
        currentPrice: 80,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: "M",
        quantity: 50,
        productId: product.id,
        variantId: variant.id,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant.id,
        sizeId: size.id,
        quantity: 30,
      },
    });

    const response = await request(app).get("/api/inventories");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get inventory by inventory ID", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Get Inventory by ID",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant for Get Inventory by ID",
        msrpPrice: 100,
        currentPrice: 80,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: "M",
        quantity: 50,
        productId: product.id,
        variantId: variant.id,
      },
    });

    const inventory = await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant.id,
        sizeId: size.id,
        quantity: 30,
      },
    });

    const response = await request(app).get(`/api/inventories/${inventory.id}`);

    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(30);
  });

  it("should get inventory by product ID", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Get Inventory by Product ID",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: 30,
      },
    });

    const response = await request(app).get(
      `/api/inventories/product/${product.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.product).not.toBeNull();
    expect(response.body.product.quantity).toBe(30);
    expect(response.body.variants.length).toBe(0);
  });

  it("should get inventory by variant ID", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Get Inventory by Variant ID",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant for Get Inventory by Variant ID",
        msrpPrice: 100,
        currentPrice: 80,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: "M",
        quantity: 50,
        productId: product.id,
        variantId: variant.id,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant.id,
        sizeId: size.id,
        quantity: 30,
      },
    });

    const response = await request(app).get(
      `/api/inventories/variant/${variant.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].quantity).toBe(30);
  });

  it("should calculate product inventory as the sum of all its variants' inventories", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Sum Calculation",
        description: "A product for testing purposes",
        msrpPrice: 200,
        currentPrice: 150,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const variant1 = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant 1 for Sum Calculation",
        msrpPrice: 200,
        currentPrice: 150,
      },
    });

    const variant2 = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant 2 for Sum Calculation",
        msrpPrice: 200,
        currentPrice: 150,
      },
    });

    const variant3 = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant 3 for Sum Calculation",
        msrpPrice: 200,
        currentPrice: 150,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant1.id,
        quantity: 20,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant2.id,
        quantity: 30,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant3.id,
        quantity: 40,
      },
    });

    const response = await request(app).get(
      `/api/inventories/product/${product.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.product).toBeNull();
    expect(response.body.variants.length).toBe(3);
    const totalQuantity = response.body.variants.reduce(
      (sum: number, variant: { quantity: number }) => sum + variant.quantity,
      0
    );
    expect(totalQuantity).toBe(90); // 20 + 30 + 40
  });

  it("should update the product inventory when a variant's inventory is deleted", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Update on Deletion",
        description: "A product for testing purposes",
        msrpPrice: 200,
        currentPrice: 150,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const variant1 = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant 1 for Update on Deletion",
        msrpPrice: 200,
        currentPrice: 150,
      },
    });

    const variant2 = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant 2 for Update on Deletion",
        msrpPrice: 200,
        currentPrice: 150,
      },
    });

    const variant3 = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant 3 for Update on Deletion",
        msrpPrice: 200,
        currentPrice: 150,
      },
    });

    const inventory1 = await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant1.id,
        quantity: 20,
      },
    });

    const inventory2 = await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant2.id,
        quantity: 30,
      },
    });

    const inventory3 = await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant3.id,
        quantity: 40,
      },
    });

    // Delete one variant's inventory
    await request(app).delete(`/api/inventories/${inventory3.id}`);

    // Check the updated inventory
    const response = await request(app).get(
      `/api/inventories/product/${product.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.product).toBeNull();
    expect(response.body.variants.length).toBe(2);
    const totalQuantity = response.body.variants.reduce(
      (sum: number, variant: { quantity: number }) => sum + variant.quantity,
      0
    );
    expect(totalQuantity).toBe(50); // 20 + 30
  });

  it("should delete an inventory", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Delete Inventory",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant for Delete Inventory",
        msrpPrice: 100,
        currentPrice: 80,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: "M",
        quantity: 50,
        productId: product.id,
        variantId: variant.id,
      },
    });

    const inventory = await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant.id,
        sizeId: size.id,
        quantity: 30,
      },
    });

    const response = await request(app).delete(
      `/api/inventories/${inventory.id}`
    );

    expect(response.status).toBe(204);
  });

  it("should create and find inventory with just product", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Product Only Inventory",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const inventory = await prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: 50,
      },
    });

    const response = await request(app).get(
      `/api/inventories/product/${product.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.product).not.toBeNull();
    expect(response.body.product.quantity).toBe(50);
  });

  it("should create and find inventory with product and variant", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Product and Variant Inventory",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant for Product and Variant Inventory",
        msrpPrice: 100,
        currentPrice: 80,
      },
    });

    const inventory = await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant.id,
        quantity: 50,
      },
    });

    const response = await request(app).get(
      `/api/inventories/variant/${variant.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].quantity).toBe(50);
  });

  it("should create and find inventory with product, variant, and size", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Product, Variant, and Size Inventory",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant for Product, Variant, and Size Inventory",
        msrpPrice: 100,
        currentPrice: 80,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: "M",
        quantity: 50,
        productId: product.id,
        variantId: variant.id,
      },
    });

    const inventory = await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant.id,
        sizeId: size.id,
        quantity: 50,
      },
    });

    const response = await request(app).get(
      `/api/inventories/variant/${variant.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].quantity).toBe(50);
  });

  it("should increment inventory quantity", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Increment Inventory",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant for Increment Inventory",
        msrpPrice: 100,
        currentPrice: 80,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: "M",
        quantity: 50,
        productId: product.id,
        variantId: variant.id,
      },
    });

    const inventory = await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant.id,
        sizeId: size.id,
        quantity: 50,
      },
    });

    const response = await request(app)
      .post(`/api/inventories/${inventory.id}/update`)
      .send({ amount: 10, operation: "increment" });

    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(60);
  });

  it("should decrement inventory quantity", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Decrement Inventory",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant for Decrement Inventory",
        msrpPrice: 100,
        currentPrice: 80,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: "M",
        quantity: 50,
        productId: product.id,
        variantId: variant.id,
      },
    });

    const inventory = await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant.id,
        sizeId: size.id,
        quantity: 50,
      },
    });

    const response = await request(app)
      .post(`/api/inventories/${inventory.id}/update`)
      .send({ amount: 5, operation: "decrement" });

    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(45);
  });

  it("should decrement size quantity and update corresponding variant and product quantities", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Decrement Size",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant for Decrement Size",
        msrpPrice: 100,
        currentPrice: 80,
      },
    });

    const size = await prisma.size.create({
      data: {
        size: "M",
        quantity: 50,
        productId: product.id,
        variantId: variant.id,
      },
    });

    const inventory = await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant.id,
        sizeId: size.id,
        quantity: 50,
      },
    });

    // Decrement the size quantity
    const response = await request(app)
      .post(`/api/inventories/${inventory.id}/update`)
      .send({ amount: 10, operation: "decrement" });

    expect(response.status).toBe(200);

    const updatedSize = await prisma.size.findUnique({
      where: { id: size.id },
    });

    const updatedVariant = await prisma.productVariant.findUnique({
      where: { id: variant.id },
    });

    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    expect(updatedSize?.quantity).toBe(40); // 50 - 10
    expect(updatedVariant?.quantity).toBe(40); // 50 - 10
    expect(updatedProduct?.quantity).toBe(40); // 50 - 10
  });

  it("should decrement variant quantity and update corresponding product quantity", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product for Decrement Variant",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: "Test Variant for Decrement Variant",
        msrpPrice: 100,
        currentPrice: 80,
      },
    });

    const inventory = await prisma.inventory.create({
      data: {
        productId: product.id,
        variantId: variant.id,
        quantity: 50,
      },
    });

    // Decrement the variant quantity
    const response = await request(app)
      .post(`/api/inventories/${inventory.id}/update`)
      .send({ amount: 10, operation: "decrement" });

    expect(response.status).toBe(200);

    const updatedVariant = await prisma.productVariant.findUnique({
      where: { id: variant.id },
    });

    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    expect(updatedVariant?.quantity).toBe(40); // 50 - 10
    expect(updatedProduct?.quantity).toBe(40); // 50 - 10
  });

  // Test for decrementing product with sizes but no variants
  it("should decrement product with sizes but no variants", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product with Sizes but No Variants",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const size1 = await prisma.size.create({
      data: {
        size: "M",
        quantity: 30,
        productId: product.id,
      },
    });

    const size2 = await prisma.size.create({
      data: {
        size: "L",
        quantity: 20,
        productId: product.id,
      },
    });

    const inventory1 = await prisma.inventory.create({
      data: {
        productId: product.id,
        sizeId: size1.id,
        quantity: 30,
      },
    });

    const inventory2 = await prisma.inventory.create({
      data: {
        productId: product.id,
        sizeId: size2.id,
        quantity: 20,
      },
    });

    // Decrement the size1 quantity
    const response = await request(app)
      .post(`/api/inventories/${inventory1.id}/update`)
      .send({ amount: 10, operation: "decrement" });

    expect(response.status).toBe(200);

    const updatedSize1 = await prisma.size.findUnique({
      where: { id: size1.id },
    });

    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    expect(updatedSize1?.quantity).toBe(20); // 30 - 10
    expect(updatedProduct?.quantity).toBe(40); // 20 + 20
  });

  // Test for decrementing product with no sizes and no variants
  it("should decrement product with no sizes and no variants", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Test Product with No Sizes and No Variants",
        description: "A product for testing purposes",
        msrpPrice: 100,
        currentPrice: 80,
        quantity: 50,
        brand: "Test Brand",
        model: "Test Model",
      },
    });

    const inventory = await prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: 50,
      },
    });

    // Decrement the product quantity
    const response = await request(app)
      .post(`/api/inventories/${inventory.id}/update`)
      .send({ amount: 10, operation: "decrement" });

    expect(response.status).toBe(200);

    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    expect(updatedProduct?.quantity).toBe(40); // 50 - 10
  });
});
