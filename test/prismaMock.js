// test/prismaMock.js
const { PrismaClient } = require("@prisma/client");

const prismaMock = {
  product: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    // add other methods as needed
  },
};

const prisma = new PrismaClient();
prisma.$transaction = jest.fn().mockImplementation((fn) => fn(prismaMock));

module.exports = { prismaMock, prisma };
