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
  CreateReviewInput,
  UpdateReviewInput,
} from "../services/reviewService";

interface CustomRequest extends Request {
  userId: number;
  isAdmin: boolean;
}

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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};

export const updateReviewHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { userName, userEmail, userId, productId, rating, comment, archived } =
    req.body;

  try {
    const review = await getReviewById(parseInt(id, 10));
    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    if (review.userId !== req.userId) {
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
      archived,
    });
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const archiveReviewByUserHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = req.userId;
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const archiveReviewByAdminHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const isAdmin = req.isAdmin;
  try {
    if (!isAdmin) {
      res
        .status(403)
        .json({ error: "You are not authorized to archive this review" });
      return;
    }
    const review = await archiveReview(parseInt(id, 10));
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unarchiveReviewByAdminHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const isAdmin = req.isAdmin;
  try {
    if (!isAdmin) {
      res
        .status(403)
        .json({ error: "You are not authorized to unarchive this review" });
      return;
    }
    const review = await unarchiveReview(parseInt(id, 10));
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const permanentlyDeleteReviewHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const isAdmin = req.isAdmin;
  try {
    if (!isAdmin) {
      res.status(403).json({
        error: "You are not authorized to permanently delete this review",
      });
      return;
    }
    await deleteReview(parseInt(id, 10));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};
