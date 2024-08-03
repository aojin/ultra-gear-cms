import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewsByUserId,
  getReviewsByProductId,
  updateReview,
  archiveReviewByUser,
  archiveReviewByAdmin,
  permanentlyDeleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview);
router.get("/", getAllReviews);
router.get("/user/:userId", getReviewsByUserId);
router.get("/product/:productId", getReviewsByProductId);
router.put("/:id", updateReview);
router.put("/archive/:id", archiveReviewByUser);
router.put("/archive/admin/:id", archiveReviewByAdmin);
router.delete("/:id", permanentlyDeleteReview);

export default router;
