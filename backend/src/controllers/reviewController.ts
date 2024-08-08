import { Request, Response } from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  archiveReview,
  unarchiveReview,
  deleteReview,
  getReviewsByUserId,
  getReviewsByProductId,
} from "../services/reviewService";

export const createReviewHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userName, userEmail, userId, productId, rating, comment } =
      req.body;
    const review = await createReview({
      userName,
      userEmail,
      userId,
      productId,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    console.error("Controller Error: Creating review:", error);
    res.status(500).json({
      error: "An error occurred while creating the review.",
    });
  }
};

export const getReviewByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const review = await getReviewById(parseInt(id, 10));
    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    res.status(200).json(review);
  } catch (error: any) {
    console.error("Controller Error: Fetching review by ID:", error);
    res.status(error.message === "NotFound" ? 404 : 500).json({
      error:
        error.message === "NotFound"
          ? "Review not found"
          : "An error occurred while fetching the review.",
    });
  }
};

export const getAllReviewsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (error) {
    console.error("Controller Error: Fetching all reviews:", error);
    res.status(500).json({
      error: "An error occurred while fetching all reviews.",
    });
  }
};

export const updateReviewHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { userId, userName, userEmail, productId, rating, comment, archived } =
    req.body;

  try {
    const review = await getReviewById(parseInt(id, 10));
    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    if (review.userId !== userId) {
      res
        .status(403)
        .json({ error: "You are not authorized to update this review" });
      return;
    }
    const updatedReview = await updateReview(parseInt(id, 10), {
      userName,
      userEmail,
      userId,
      productId,
      rating,
      comment,
    });
    res.json(updatedReview);
  } catch (error: any) {
    console.error("Controller Error: Updating review:", error);
    res.status(error.message === "NotFound" ? 404 : 500).json({
      error: "An error occurred while updating the review.",
    });
  }
};

export const archiveReviewByUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const review = await getReviewById(parseInt(id, 10));
    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    if (review.userId !== userId) {
      res
        .status(403)
        .json({ error: "You are not authorized to archive this review" });
      return;
    }
    const archivedReview = await archiveReview(parseInt(id, 10));
    res.status(200).json(archivedReview);
  } catch (error: any) {
    console.error("Controller Error: Archiving review:", error);
    res.status(error.message === "NotFound" ? 404 : 500).json({
      error: "An error occurred while archiving the review.",
    });
  }
};

export const archiveReviewByAdminHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { isAdmin } = req.body;
  try {
    if (!isAdmin) {
      res
        .status(403)
        .json({ error: "You are not authorized to archive this review" });
      return;
    }
    const review = await archiveReview(parseInt(id, 10));
    res.status(200).json(review);
  } catch (error: any) {
    console.error("Controller Error: Archiving review:", error);
    res.status(error.message === "NotFound" ? 404 : 500).json({
      error: "An error occurred while archiving the review.",
    });
  }
};

export const unarchiveReviewByAdminHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { isAdmin } = req.body;
  try {
    if (!isAdmin) {
      res
        .status(403)
        .json({ error: "You are not authorized to unarchive this review" });
      return;
    }
    const review = await unarchiveReview(parseInt(id, 10));
    res.status(200).json(review);
  } catch (error: any) {
    console.error("Controller Error: Unarchiving review:", error);
    res.status(error.message === "NotFound" ? 404 : 500).json({
      error: "An error occurred while unarchiving the review.",
    });
  }
};

export const permanentlyDeleteReviewHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { isAdmin } = req.body;
  try {
    if (!isAdmin) {
      res.status(403).json({
        error: "You are not authorized to permanently delete this review",
      });
      return;
    }
    await deleteReview(parseInt(id, 10));
    res.status(204).send();
  } catch (error: any) {
    console.error("Controller Error: Deleting review:", error);
    res.status(error.message === "NotFound" ? 404 : 500).json({
      error: "An error occurred while deleting the review.",
    });
  }
};

export const getReviewsByUserIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const reviews = await getReviewsByUserId(parseInt(userId, 10));
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Controller Error: Fetching reviews by user ID:", error);
    res.status(500).json({
      error: "An error occurred while fetching reviews by user ID.",
    });
  }
};

export const getReviewsByProductIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { productId } = req.params;
  try {
    const reviews = await getReviewsByProductId(parseInt(productId, 10));
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Controller Error: Fetching reviews by product ID:", error);
    res.status(500).json({
      error: "An error occurred while fetching reviews by product ID.",
    });
  }
};
