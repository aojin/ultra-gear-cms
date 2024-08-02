const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Middleware to simulate authentication
const simulateAuthentication = (req, res, next) => {
  // Simulating user authentication and setting req.userId and req.isAdmin
  req.userId = 1; // Replace this with the actual user ID from the authentication system
  req.isAdmin = true; // Replace this with the actual admin check from the authentication system
  next();
};

router.post("/", reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/user/:userId", reviewController.getReviewsByUserId);
router.get("/product/:productId", reviewController.getReviewsByProductId);
router.put("/:id", simulateAuthentication, reviewController.updateReview);
router.put(
  "/:id/archive",
  simulateAuthentication,
  reviewController.archiveReviewByUser
);
router.put(
  "/:id/archive/admin",
  simulateAuthentication,
  reviewController.archiveReviewByAdmin
);
router.delete(
  "/:id",
  simulateAuthentication,
  reviewController.permanentlyDeleteReview
);

module.exports = router;
