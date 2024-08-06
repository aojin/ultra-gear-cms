import express from "express";
import {
  createSizeHandler, // POST / - Create a new size
  getAllSizesHandler, // GET / - Get all sizes
  getSizesByProductIdHandler, // GET /product/:productId - Get sizes by product ID
  getSizesByVariantIdHandler, // GET /variant/:variantId - Get sizes by variant ID
  getSizeByIdHandler, // GET /:id - Get a size by ID
  updateSizeHandler, // PUT /:id - Update a size
  archiveSizeHandler, // POST /:id/archive - Archive a size
  unarchiveSizeHandler, // POST /:id/unarchive - Unarchive a size
  deleteSizeHandler, // DELETE /:id - Delete a size
} from "../controllers/sizeController.js";

const router = express.Router();

// Create a new size
router.post("/", createSizeHandler);

// Get all sizes
router.get("/", getAllSizesHandler);

// Get sizes by product ID
router.get("/product/:productId", getSizesByProductIdHandler);

// Get sizes by variant ID
router.get("/variant/:variantId", getSizesByVariantIdHandler);

// Get a size by ID
router.get("/:id", getSizeByIdHandler);

// Update a size
router.put("/:id", updateSizeHandler);

// Archive a size
router.post("/:id/archive", archiveSizeHandler);

// Unarchive a size
router.post("/:id/unarchive", unarchiveSizeHandler);

// Delete a size
router.delete("/:id", deleteSizeHandler);

export default router;
