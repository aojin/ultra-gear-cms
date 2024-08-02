const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/", reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.put("/:id", reviewController.updateReview);
router.put("/archive/:id", reviewController.archiveReview);
router.delete("/permanent/:id", reviewController.permanentlyDeleteReview);
router.get("/user/:userId", reviewController.getReviewsByUserId);
router.get("/product/:productId", reviewController.getReviewsByProductId);

module.exports = router;
