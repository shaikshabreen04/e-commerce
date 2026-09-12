import express from "express";

import {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  publishProduct,
  unpublishProduct
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getProducts);
router.get("/:id", getSingleProduct);

// ADMIN ROUTES
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);
router.patch("/:id/publish", authMiddleware, adminMiddleware, publishProduct);
router.patch("/:id/unpublish", authMiddleware, adminMiddleware, unpublishProduct);

export default router;