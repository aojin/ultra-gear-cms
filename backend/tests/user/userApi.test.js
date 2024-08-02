const request = require("supertest");
const app = require("../../app");
const prisma = require("../../prisma/prismaClient");

describe("User API Tests", () => {
  let userId;

  beforeAll(async () => {
    try {
      // Create a user for testing
      const user = await prisma.user.create({
        data: {
          name: "Test User",
          email: `testuser-${Date.now()}@example.com`,
          password: "securepassword123",
        },
      });
      userId = user.id;
    } catch (error) {
      console.error("Error setting up test data:", error);
    }
  });

  afterAll(async () => {
    // Clean up test data
    try {
      await prisma.user.deleteMany({
        where: { email: { startsWith: "testuser-" } },
      });
    } catch (error) {
      console.error("Error cleaning up test data:", error);
    }
  });

  it("should update a User", async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({ name: "Updated User" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Updated User");
  });

  it("should delete a User", async () => {
    const res = await request(app).delete(`/api/users/${userId}`);

    expect(res.statusCode).toEqual(200);
    // Optionally, verify the user no longer exists
    const deletedUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    expect(deletedUser).toBeNull();
  });
});
