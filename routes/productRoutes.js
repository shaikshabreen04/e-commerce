routes/productRoutes.js


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


// GET ALL PRODUCTS
router.get("/",authMiddleware,getProducts);


// GET SINGLE PRODUCT
router.get( "/:id",authMiddleware,getSingleProduct);


// CREATE PRODUCT - ADMIN
router.post("/",authMiddleware,adminMiddleware,createProduct);


// UPDATE PRODUCT - ADMIN
router.put("/:id",authMiddleware,adminMiddleware,updateProduct);


// DELETE PRODUCT - ADMIN
router.delete("/:id",authMiddleware,adminMiddleware,deleteProduct);


// PUBLISH PRODUCT - ADMIN
router.patch("/:id/publish",authMiddleware,adminMiddleware,publishProduct);


// UNPUBLISH PRODUCT - ADMIN
router.patch("/:id/unpublish",authMiddleware,adminMiddleware, unpublishProduct);


export default router;