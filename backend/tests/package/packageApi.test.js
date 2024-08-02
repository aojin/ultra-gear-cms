const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const app = require("../../app");

const prisma = new PrismaClient();

describe("Package API Tests", () => {
  let packageId;

  it("should create a new Package", async () => {
    const res = await request(app).post("/api/packages").send({
      name: "Test Package",
      description: "Test Description",
      price: 100.0,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    packageId = res.body.id;
  });

  it("should fetch all packages", async () => {
    const res = await request(app).get("/api/packages");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should update a Package", async () => {
    const res = await request(app).put(`/api/packages/${packageId}`).send({
      name: "Updated Package",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Updated Package");
  });

  it("should delete a Package", async () => {
    const res = await request(app).delete(`/api/packages/${packageId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
  });
});
