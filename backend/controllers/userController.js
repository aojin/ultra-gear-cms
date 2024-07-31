// backend/controllers/userController.js
const prisma = require("../prisma/prismaClient");

exports.createUser = async (req, res) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
