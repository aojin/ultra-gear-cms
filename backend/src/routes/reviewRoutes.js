import express from "express";
import {
  createReviewHandler,
  getAllReviewsHandler,
  getReviewsByUserIdHandler,
  getReviewsByProductIdHandler,
  updateReviewHandler,
  archiveReviewByUserHandler,
  archiveReviewByAdminHandler,
  unarchiveReviewByAdminHandler,
  permanentlyDeleteReviewHandler,
} from "../controllers/reviewController";

const router = express.Router();

router.post("/", createReviewHandler);
router.get("/", getAllReviewsHandler);
router.get("/user/:userId", getReviewsByUserIdHandler);
router.get("/product/:productId", getReviewsByProductIdHandler);
router.put("/:id", updateReviewHandler);
router.put("/archive/:id", archiveReviewByUserHandler);
router.put("/archive/admin/:id", archiveReviewByAdminHandler);
router.put("/unarchive/admin/:id", unarchiveReviewByAdminHandler);
router.delete("/:id", permanentlyDeleteReviewHandler);

export default router;
