import { Request, Response } from "express";
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
  CreateUserInput,
  UpdateUserInput,
} from "../services/userService.js";

export const createUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name, address1, address2, phoneNumber } = req.body;
    const user = await createUser({
      email,
      password,
      name,
      address1,
      address2,
      phoneNumber,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsersHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await getUserById(parseInt(id, 10));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const { email, password, name, address1, address2, phoneNumber } = req.body;
    const user = await updateUser(parseInt(id, 10), {
      email,
      password,
      name,
      address1,
      address2,
      phoneNumber,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const archiveUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await archiveUser(parseInt(id, 10));
    res.status(200).json(user); // Ensure proper status code
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const permanentlyDeleteUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await permanentlyDeleteUser(parseInt(id, 10));
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const getOrdersByUserIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const orders = await getOrdersByUserId(parseInt(userId, 10));
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUserCartsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const carts = await getAllUserCarts(parseInt(userId, 10));
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUserReviewsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const reviews = await getAllUserReviews(parseInt(userId, 10));
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
