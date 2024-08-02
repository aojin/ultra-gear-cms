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
  const userId = req.userId;
  try {
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    if (review.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this review" });
    }
    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.archiveReviewByUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    if (review.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to archive this review" });
    }
    const archivedReview = await prisma.review.update({
      where: { id: parseInt(id, 10) },
      data: { archived: true },
    });
    res.status(200).json(archivedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.archiveReviewByAdmin = async (req, res) => {
  const { id } = req.params;
  const isAdmin = req.isAdmin;
  try {
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "You are not authorized to archive this review" });
    }
    const review = await prisma.review.update({
      where: { id: parseInt(id, 10) },
      data: { archived: true },
    });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.permanentlyDeleteReview = async (req, res) => {
  const { id } = req.params;
  const isAdmin = req.isAdmin;
  try {
    if (!isAdmin) {
      return res.status(403).json({
        error: "You are not authorized to permanently delete this review",
      });
    }
    await prisma.review.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).send();
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
