const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("User Model Tests", () => {
  let userId;

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        password: "password",
      },
    });
    userId = user.id;
  });

  test("should create a User", async () => {
    const user = await prisma.user.create({
      data: {
        email: `newtest${Date.now()}@example.com`,
        password: "password",
      },
    });
    expect(user).toHaveProperty("id");
  });

  test("should read a User", async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    expect(user).toHaveProperty("id");
    expect(user.email).toContain("test");
  });

  test("should update a User", async () => {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: "Updated Name",
      },
    });
    expect(user).toHaveProperty("id");
    expect(user.name).toBe("Updated Name");
  });

  test("should delete a User", async () => {
    const user = await prisma.user.delete({
      where: { id: userId },
    });
    expect(user).toHaveProperty("id");
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
