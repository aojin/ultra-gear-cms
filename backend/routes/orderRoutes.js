// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateOrder);
router.put("/archive/:id", orderController.archiveOrder);
router.delete("/permanent/:id", orderController.permanentlyDeleteOrder);
router.get("/user/:userId", orderController.getOrdersByUserId);

module.exports = router;
