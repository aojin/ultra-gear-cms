const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Package Model Tests", () => {
  let packageId;

  beforeAll(async () => {
    // Ensure a clean state by deleting any existing packages
    await prisma.package.deleteMany({});

    // Create a test package for testing purposes
    const testPackage = await prisma.package.create({
      data: {
        name: "Test Package",
        description: "Test Description",
        price: 100.0,
      },
    });

    packageId = testPackage.id;
  });

  afterAll(async () => {
    // Clean up the database after all tests
    await prisma.package.deleteMany({});
    await prisma.$disconnect();
  });

  test("should create a Package", async () => {
    const newPackage = await prisma.package.create({
      data: {
        name: "New Test Package",
        description: "New Test Description",
        price: 150.0,
      },
    });

    expect(newPackage).toHaveProperty("id");
    expect(newPackage.name).toBe("New Test Package");
    expect(newPackage.description).toBe("New Test Description");
    expect(newPackage.price).toBe(150.0);
  });

  test("should read a Package", async () => {
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    expect(pkg).toHaveProperty("id");
    expect(pkg.name).toBe("Test Package");
    expect(pkg.description).toBe("Test Description");
    expect(pkg.price).toBe(100.0);
  });

  test("should update a Package", async () => {
    const updatedPackage = await prisma.package.update({
      where: { id: packageId },
      data: {
        name: "Updated Package",
        description: "Updated Description",
        price: 200.0,
      },
    });

    expect(updatedPackage).toHaveProperty("id");
    expect(updatedPackage.name).toBe("Updated Package");
    expect(updatedPackage.description).toBe("Updated Description");
    expect(updatedPackage.price).toBe(200.0);
  });

  test("should delete a Package", async () => {
    const deletedPackage = await prisma.package.delete({
      where: { id: packageId },
    });

    expect(deletedPackage).toHaveProperty("id");
  });
});
