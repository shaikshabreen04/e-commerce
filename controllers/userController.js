import bcrypt from "bcryptjs";
import User from "../models/User.js";


// ========================================
// GET ALL USERS
// GET /api/users
// ADMIN ONLY
// ========================================

export const getUsers = async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.status(200).json({
      users
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get users",
      error: error.message
    });
  }
};


// ========================================
// GET SINGLE USER
// GET /api/users/:id
// ADMIN ONLY
// ========================================

export const getUser = async (req, res) => {
  try {

    const user = await User
      .findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get user",
      error: error.message
    });
  }
};


// ========================================
// UPDATE USER
// PUT /api/users/:id
// ADMIN ONLY
// ========================================

export const updateUser = async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    const updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (email) {
      updateData.email = email;
    }

    if (role) {
      updateData.role = role;
    }

    // Hash new password if provided
    if (password) {
      updateData.password = await bcrypt.hash(
        password,
        10
      );
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message
    });
  }
};


// ========================================
// DELETE USER
// DELETE /api/users/:id
// ADMIN ONLY
// ========================================

export const deleteUser = async (req, res) => {
  try {

    const user = await User.findByIdAndDelete(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message
    });
  }
};