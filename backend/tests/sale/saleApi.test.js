const request = require("supertest");
const { prisma } = require("../../prisma/prismaClient");
const app = require("../../app");

let saleId;

beforeAll(async () => {
  try {
    // Create a sale for testing
    const sale = await prisma.sale.create({
      data: {
        name: "Test Sale",
        saleAmount: 5.0,
        title: "Test Sale Title",
        tagline: "Test Tagline",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Ensure valid date range
      },
    });
    saleId = sale.id;
  } catch (error) {
    console.error("Error during setup:", error);
  }
});

afterAll(async () => {
  try {
    // Cleanup specific instances created in this test suite
    if (saleId) {
      await prisma.sale.delete({ where: { id: saleId } });
    }
    await prisma.$disconnect();
  } catch (error) {
    console.error("Error during teardown:", error);
  }
});

describe("Sale API Tests", () => {
  it("should create a new Sale", async () => {
    const res = await request(app)
      .post("/api/sales")
      .send({
        name: "New Sale",
        saleAmount: 10.0,
        title: "New Sale Title",
        tagline: "New Tagline",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      });
    console.log("Create Sale Response:", res.body); // Log the response
    console.log("Create Sale Status Code:", res.statusCode); // Log the status code
    expect(res.statusCode).toEqual(201); // Updated to match creation status code
    expect(res.body).toHaveProperty("id");
    saleId = res.body.id; // Save saleId for further tests
  });

  it("should update a Sale", async () => {
    const res = await request(app)
      .put(`/api/sales/${saleId}`)
      .send({
        name: "Updated Sale",
        saleAmount: 20.0,
        title: "Updated Sale Title",
        tagline: "Updated Tagline",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      });
    console.log("Update Sale Response:", res.body); // Log the response
    console.log("Update Sale Status Code:", res.statusCode); // Log the status code
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Updated Sale");
  });

  it("should delete a Sale", async () => {
    const res = await request(app).delete(`/api/sales/${saleId}`);
    console.log("Delete Sale Response:", res.body); // Log the response
    console.log("Delete Sale Status Code:", res.statusCode); // Log the status code
    expect(res.statusCode).toEqual(204); // Updated to match deletion status code
  });
});
