const prisma = require("../prisma/prismaClient");

exports.createReview = async (req, res) => {
  try {
    const review = await prisma.review.create({
      data: req.body,
    });
    res.status(201).json(review);
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

exports.archiveReview = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await prisma.review.update({
      where: { id: parseInt(id, 10) },
      data: { archived: true },
    });
    res.status(200).json(review); // Ensure proper status code
  } catch (error) {
    if (error.code === "P2025") {
      // Prisma specific error for not found
      res.status(404).json({ error: "Review not found" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.permanentlyDeleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.review.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).send(); // Send No Content response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: parseInt(userId, 10) },
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewsByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId, 10) },
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
