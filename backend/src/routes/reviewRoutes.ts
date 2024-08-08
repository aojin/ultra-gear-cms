import express, { RequestHandler } from "express";
import {
  createReviewHandler,
  getAllReviewsHandler,
  getReviewByIdHandler, // Add this import
  getReviewsByUserIdHandler,
  getReviewsByProductIdHandler,
  updateReviewHandler,
  archiveReviewByUserHandler,
  archiveReviewByAdminHandler,
  unarchiveReviewByAdminHandler,
  permanentlyDeleteReviewHandler,
} from "../controllers/reviewController";

const router = express.Router();

router.post("/", createReviewHandler as RequestHandler);
router.get("/", getAllReviewsHandler as RequestHandler);
router.get("/:id", getReviewByIdHandler as RequestHandler); // Add this route
router.get("/user/:userId", getReviewsByUserIdHandler as RequestHandler);
router.get(
  "/product/:productId",
  getReviewsByProductIdHandler as RequestHandler
);
router.put("/:id", updateReviewHandler as RequestHandler);
router.put("/archive/:id", archiveReviewByUserHandler as RequestHandler);
router.put("/archive/admin/:id", archiveReviewByAdminHandler as RequestHandler);
router.put(
  "/unarchive/admin/:id",
  unarchiveReviewByAdminHandler as RequestHandler
);
router.delete("/:id", permanentlyDeleteReviewHandler as RequestHandler);

export default router;
