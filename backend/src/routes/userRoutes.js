import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  archiveUser,
  permanentlyDeleteUser,
  getOrdersByUserId,
  getAllUserCarts,
  getAllUserReviews,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/archive/:id", archiveUser);
router.delete("/:id", permanentlyDeleteUser);
router.get("/:userId/orders", getOrdersByUserId);
router.get("/:userId/carts", getAllUserCarts);
router.get("/:userId/reviews", getAllUserReviews);

export default router;
