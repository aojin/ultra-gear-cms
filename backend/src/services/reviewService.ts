import { PrismaClient, Review, Prisma } from "@prisma/client";
import { CreateReviewInput, UpdateReviewInput } from "../types";

const prisma = new PrismaClient();

export const createReview = async (
  data: CreateReviewInput
): Promise<Review> => {
  try {
    return await prisma.review.create({ data });
  } catch (error) {
    console.error("Service Error: Creating review:", error);
    throw new Error("Service Error: Failed to create review");
  }
};

export const getAllReviews = async (): Promise<Review[]> => {
  try {
    return await prisma.review.findMany();
  } catch (error) {
    console.error("Service Error: Fetching all reviews:", error);
    throw new Error("Service Error: Failed to fetch all reviews");
  }
};

export const getReviewById = async (id: number): Promise<Review | null> => {
  try {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new Error("NotFound");
    }
    return review;
  } catch (error: any) {
    console.error("Service Error: Fetching review by ID:", error);
    throw new Error(
      error.message === "NotFound"
        ? "NotFound"
        : "Service Error: Failed to fetch review by ID"
    );
  }
};

export const updateReview = async (
  id: number,
  data: UpdateReviewInput
): Promise<Review> => {
  try {
    const review = await prisma.review.update({ where: { id }, data });
    if (!review) {
      throw new Error("NotFound");
    }
    return review;
  } catch (error: any) {
    console.error("Service Error: Updating review:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("NotFound");
      }
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to update review");
    }
  }
};

export const archiveReview = async (id: number): Promise<Review> => {
  try {
    const review = await prisma.review.update({
      where: { id },
      data: { archived: true },
    });
    if (!review) {
      throw new Error("NotFound");
    }
    return review;
  } catch (error: any) {
    console.error("Service Error: Archiving review:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("NotFound");
      }
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to archive review");
    }
  }
};

export const unarchiveReview = async (id: number): Promise<Review> => {
  try {
    const review = await prisma.review.update({
      where: { id },
      data: { archived: false },
    });
    if (!review) {
      throw new Error("NotFound");
    }
    return review;
  } catch (error: any) {
    console.error("Service Error: Unarchiving review:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("NotFound");
      }
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to unarchive review");
    }
  }
};

export const deleteReview = async (id: number): Promise<void> => {
  try {
    await prisma.review.delete({ where: { id } });
  } catch (error: any) {
    console.error("Service Error: Deleting review:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("NotFound");
      }
      throw new Error(
        "Service Error: Unique constraint violation or other known error"
      );
    } else {
      throw new Error("Service Error: Failed to delete review");
    }
  }
};

export const getReviewsByUserId = async (userId: number): Promise<Review[]> => {
  try {
    return await prisma.review.findMany({ where: { userId } });
  } catch (error) {
    console.error("Service Error: Fetching reviews by user ID:", error);
    throw new Error("Service Error: Failed to fetch reviews by user ID");
  }
};

export const getReviewsByProductId = async (
  productId: number
): Promise<Review[]> => {
  try {
    return await prisma.review.findMany({ where: { productId } });
  } catch (error) {
    console.error("Service Error: Fetching reviews by product ID:", error);
    throw new Error("Service Error: Failed to fetch reviews by product ID");
  }
};
