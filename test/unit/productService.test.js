import { expect } from "chai";
import sinon from "sinon";
import { PrismaClient } from "@prisma/client";
import * as productService from "../../backend/src/services/productService.js";

describe("Product Service", () => {
  let prismaMock;
  let createProductStub;
  let findManyStub;
  let findUniqueStub;

  beforeEach(() => {
    // Initialize the mock PrismaClient
    prismaMock = sinon.createStubInstance(PrismaClient);

    // Stub the methods you need
    createProductStub = prismaMock.product.create.returns(
      Promise.resolve({ id: 1, name: "Test Product" })
    );
    findManyStub = prismaMock.product.findMany.returns(
      Promise.resolve([{ id: 1, name: "Test Product" }])
    );
    findUniqueStub = prismaMock.product.findUnique.returns(
      Promise.resolve({ id: 1, name: "Test Product" })
    );

    // Ensure your service uses the mock client
    // For example, inject `prismaMock` into your service
    productService.__set__("prisma", prismaMock);
  });

  afterEach(() => {
    sinon.restore(); // Restore the original functionality
  });

  it("should create a product", async () => {
    const newProduct = await productService.createProduct({
      name: "Test Product",
      description: "Description",
      msrpPrice: 100,
      currentPrice: 80,
      brand: "Brand",
      model: "Model",
    });

    expect(createProductStub.calledOnce).to.be.true;
    expect(newProduct).to.deep.equal({ id: 1, name: "Test Product" });
  });

  // Add other tests as needed
});
