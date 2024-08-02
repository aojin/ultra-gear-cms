const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createSale = async (req, res) => {
  try {
    const sale = await prisma.sale.create({
      data: req.body,
    });
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (sale) {
      res.status(200).json(sale);
    } else {
      res.status(404).json({ error: "Sale not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const sale = await prisma.sale.update({
      where: { id: parseInt(req.params.id, 10) },
      data: req.body,
    });
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    await prisma.sale.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
