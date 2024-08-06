import express from "express";
import {
  createPackageHandler,
  getAllPackagesHandler,
  updatePackageHandler,
  deletePackageHandler,
} from "../controllers/packageController.js";

const router = express.Router();

router.post("/", createPackageHandler);
router.get("/", getAllPackagesHandler);
router.put("/:id", updatePackageHandler);
router.delete("/:id", deletePackageHandler);

export default router;
