const express = require("express");
const router = express.Router();
const cartItemController = require("../controllers/cartItemController");

router.post("/", cartItemController.createCartItem);
router.get("/", cartItemController.getAllCartItems);
router.put("/:id", cartItemController.updateCartItem);
router.delete("/:id", cartItemController.deleteCartItem);

module.exports = router;
