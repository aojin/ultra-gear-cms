import request from "supertest";
import app from "../../backend/src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("User Controller", () => {
  let testUser: any;

  beforeAll(async () => {
    // Optionally clear the database or seed data here
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new user", async () => {
    const response = await request(app).post("/api/users").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      address1: "123 Test St.",
      address2: "Apt 1",
      phoneNumber: "555-555-5555",
    });

    expect(response.status).toBe(200);
    expect(response.body.email).toBe("test@example.com");
    testUser = response.body;
  });

  it("should get all users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a user by ID", async () => {
    const response = await request(app).get(`/api/users/${testUser.id}`);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe("test@example.com");
  });

  it("should return 404 for non-existent user", async () => {
    const response = await request(app).get("/api/users/999999");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("should update a user", async () => {
    const response = await request(app).put(`/api/users/${testUser.id}`).send({
      name: "Updated User",
      address1: "456 Updated St.",
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated User");
    expect(response.body.address1).toBe("456 Updated St.");
  });

  it("should archive a user", async () => {
    const response = await request(app).put(
      `/api/users/archive/${testUser.id}`
    );
    expect(response.status).toBe(200);
    expect(response.body.archived).toBe(true);
  });

  it("should return 404 when archiving a non-existent user", async () => {
    const response = await request(app).put("/api/users/archive/999999");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("should permanently delete a user", async () => {
    const response = await request(app).delete(`/api/users/${testUser.id}`);
    expect(response.status).toBe(204);
  });

  it("should return 404 when deleting a non-existent user", async () => {
    const response = await request(app).delete("/api/users/999999");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  it("should get orders by user ID", async () => {
    const response = await request(app).get(`/api/users/${testUser.id}/orders`);
    expect(response.status).toBe(200);
    // Add more assertions based on the expected response structure
  });

  it("should get all user carts by user ID", async () => {
    const response = await request(app).get(`/api/users/${testUser.id}/carts`);
    expect(response.status).toBe(200);
    // Add more assertions based on the expected response structure
  });

  it("should get all user reviews by user ID", async () => {
    const response = await request(app).get(
      `/api/users/${testUser.id}/reviews`
    );
    expect(response.status).toBe(200);
    // Add more assertions based on the expected response structure
  });
});
