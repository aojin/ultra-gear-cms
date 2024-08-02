const express = require("express");
const promoCodeController = require("../controllers/promoCodeController");

const router = express.Router();

router.post("/", promoCodeController.createPromoCode);
router.get("/", promoCodeController.getAllPromoCodes);
router.put("/:id", promoCodeController.updatePromoCode);
router.delete("/:id", promoCodeController.deletePromoCode);

module.exports = router;
