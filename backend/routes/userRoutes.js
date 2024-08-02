// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.put("/archive/:id", userController.archiveUser); // Updated to PUT for archiving
router.delete("/permanent/:id", userController.permanentlyDeleteUser); // Permanent delete route
router.get("/carts/:userId", userController.getAllUserCarts);
router.get("/reviews/:userId", userController.getAllUserReviews);

module.exports = router;
