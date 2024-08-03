import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPackage = async (req, res) => {
  try {
    const newPackage = await prisma.package.create({
      data: req.body,
    });
    res.status(200).json(newPackage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllPackages = async (req, res) => {
  try {
    const packages = await prisma.package.findMany();
    res.status(200).json(packages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updatePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPackage = await prisma.package.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPackage = await prisma.package.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(200).json(deletedPackage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
