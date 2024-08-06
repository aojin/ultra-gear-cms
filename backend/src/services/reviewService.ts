import { PrismaClient, Review } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateReviewInput = {
  userName: string;
  userEmail: string;
  userId: number;
  productId: number;
  rating: number;
  comment?: string;
};

export type UpdateReviewInput = {
  userName?: string;
  userEmail?: string;
  userId?: number;
  productId?: number;
  rating?: number;
  comment?: string;
  archived?: boolean;
};

export const createReview = async (
  data: CreateReviewInput
): Promise<Review> => {
  return await prisma.review.create({
    data,
  });
};

export const getAllReviews = async (): Promise<Review[]> => {
  return await prisma.review.findMany();
};

export const getReviewById = async (id: number): Promise<Review | null> => {
  return await prisma.review.findUnique({
    where: { id },
  });
};

export const updateReview = async (
  id: number,
  data: UpdateReviewInput
): Promise<Review> => {
  return await prisma.review.update({
    where: { id },
    data,
  });
};

export const archiveReview = async (id: number): Promise<Review> => {
  return await prisma.review.update({
    where: { id },
    data: { archived: true },
  });
};

export const unarchiveReview = async (id: number): Promise<Review> => {
  return await prisma.review.update({
    where: { id },
    data: { archived: false },
  });
};

export const deleteReview = async (id: number): Promise<void> => {
  await prisma.review.delete({
    where: { id },
  });
};

export const getReviewsByUserId = async (userId: number): Promise<Review[]> => {
  return await prisma.review.findMany({
    where: { userId },
  });
};

export const getReviewsByProductId = async (
  productId: number
): Promise<Review[]> => {
  return await prisma.review.findMany({
    where: { productId },
  });
};
