import {
  PrismaClient,
  User,
  Order,
  Cart,
  Review,
  Prisma,
} from "@prisma/client";

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
  try {
    return await prisma.user.create({ data });
  } catch (error) {
    console.error("Service Error: Creating User:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to create user");
    }
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    console.error("Service Error: Fetching all users:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to fetch all users");
    }
  }
};

export const getUserById = async (id: number): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    console.error("Service Error: Fetching User By Id:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to fetch user by id");
    }
  }
};

export const updateUser = async (
  id: number,
  data: UpdateUserInput
): Promise<User> => {
  try {
    return await prisma.user.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Service Error: Updating User:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to update user");
    }
  }
};

export const archiveUser = async (id: number): Promise<User> => {
  try {
    return await prisma.user.update({
      where: { id },
      data: { archived: true },
    });
  } catch (error) {
    console.error("Service Error: Archiving User:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("User not found");
      }
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to archive user");
    }
  }
};

export const permanentlyDeleteUser = async (id: number): Promise<void> => {
  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Service Error: Permanently Deleting User:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("User not found");
      }
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to permanently delete user");
    }
  }
};

export const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
  try {
    return await prisma.order.findMany({
      where: { userId },
    });
  } catch (error) {
    console.error("Service Error: Getting Orders By User Id:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to get orders");
    }
  }
};

export const getAllUserCarts = async (userId: number): Promise<Cart[]> => {
  try {
    return await prisma.cart.findMany({
      where: { userId },
    });
  } catch (error) {
    console.error("Service Error: Fetching User's Carts:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to fetch user carts");
    }
  }
};

export const getAllUserReviews = async (userId: number): Promise<Review[]> => {
  try {
    return await prisma.review.findMany({
      where: { userId },
    });
  } catch (error) {
    console.error("Service Error: Fetching User's Reviews:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Service Error: Known request error occurred");
    } else {
      throw new Error("Service Error: Failed to fetch user reviews");
    }
  }
};
