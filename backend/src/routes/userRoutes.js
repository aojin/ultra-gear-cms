import express from "express";
import {
  createUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  archiveUserHandler,
  permanentlyDeleteUserHandler,
  getOrdersByUserIdHandler,
  getAllUserCartsHandler,
  getAllUserReviewsHandler,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUserHandler);
router.get("/", getAllUsersHandler);
router.get("/:id", getUserByIdHandler);
router.put("/:id", updateUserHandler);
router.put("/archive/:id", archiveUserHandler);
router.delete("/:id", permanentlyDeleteUserHandler);
router.get("/:userId/orders", getOrdersByUserIdHandler);
router.get("/:userId/carts", getAllUserCartsHandler);
router.get("/:userId/reviews", getAllUserReviewsHandler);

export default router;
