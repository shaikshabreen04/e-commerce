import express from "express";

import {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// Get all users - ADMIN
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getUsers
);


// Get single user - ADMIN
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getUser
);


// Update user - ADMIN
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateUser
);


// Delete user - ADMIN
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);


export default router;