import express from "express";
import {
  createPackageHandler,
  getAllPackagesHandler,
  getPackageByIdHandler,
  updatePackageHandler,
  deletePackageHandler,
} from "../controllers/packageController";

const router = express.Router();

router.post("/", createPackageHandler);
router.get("/", getAllPackagesHandler);
router.get("/:id", getPackageByIdHandler);
router.put("/:id", updatePackageHandler);
router.delete("/:id", deletePackageHandler);

export default router;
