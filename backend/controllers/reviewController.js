// backend/controllers/reviewController.js
const prisma = require("../prisma/prismaClient");

exports.createReview = async (req, res) => {
  try {
    const review = await prisma.review.create({ data: req.body });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await prisma.review.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await prisma.review.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
