// backend/controllers/promoCodeController.js
const prisma = require("../prisma/prismaClient");

exports.createPromoCode = async (req, res) => {
  const { code, validFrom, validTo, saleId } = req.body;
  try {
    const promoCode = await prisma.promoCode.create({
      data: {
        code,
        validFrom,
        validTo,
        sale: {
          connect: { id: saleId },
        },
      },
    });
    res.status(201).json(promoCode);
  } catch (error) {
    console.error("Error creating PromoCode:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getPromoCodeById = async (req, res) => {
  const { id } = req.params;
  try {
    const promoCode = await prisma.promoCode.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!promoCode) {
      return res.status(404).json({ error: "PromoCode not found" });
    }

    res.status(200).json(promoCode);
  } catch (error) {
    console.error("Error retrieving PromoCode:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await prisma.promoCode.findMany();
    res.json(promoCodes);
  } catch (error) {
    console.error("Error fetching PromoCodes:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.updatePromoCode = async (req, res) => {
  const { id } = req.params;
  const { code, validFrom, validTo } = req.body;
  try {
    const promoCode = await prisma.promoCode.update({
      where: { id: Number(id) },
      data: {
        code,
        validFrom,
        validTo,
      },
    });
    res.json(promoCode);
  } catch (error) {
    console.error("Error updating PromoCode:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deletePromoCode = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPromoCode = await prisma.promoCode.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(204).json({ message: "PromoCode deleted successfully" });
  } catch (error) {
    console.error("Error deleting PromoCode:", error);
    res.status(500).json({ error: error.message });
  }
};
