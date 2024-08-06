import { PrismaClient, User, Order, Cart, Review } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateUserInput = {
  email: string;
  password: string;
  name?: string;
  address1?: string;
  address2?: string;
  phoneNumber?: string;
};

export type UpdateUserInput = Partial<CreateUserInput> & { archived?: boolean };

export const createUser = async (data: CreateUserInput): Promise<User> => {
  return await prisma.user.create({ data });
};

export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getUserById = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { id } });
};

export const updateUser = async (
  id: number,
  data: UpdateUserInput
): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const archiveUser = async (id: number): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data: { archived: true },
  });
};

export const permanentlyDeleteUser = async (id: number): Promise<void> => {
  await prisma.user.delete({
    where: { id },
  });
};

export const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
  return await prisma.order.findMany({
    where: { userId },
  });
};

export const getAllUserCarts = async (userId: number): Promise<Cart[]> => {
  return await prisma.cart.findMany({
    where: { userId },
  });
};

export const getAllUserReviews = async (userId: number): Promise<Review[]> => {
  return await prisma.review.findMany({
    where: { userId },
  });
};
