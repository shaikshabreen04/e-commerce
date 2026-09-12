import Product from "../models/Product.js";


// ========================================
// CREATE PRODUCT - ADMIN ONLY
// ========================================

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, published } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      published
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create product",
      error: error.message
    });
  }
};


// ========================================
// GET ALL PRODUCTS
// ADMIN -> ALL PRODUCTS
// USER -> ONLY PUBLISHED PRODUCTS
// + FILTER + SORT + PAGINATION
// ========================================

export const getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    // Normal users can only see published products
    if (!req.user || req.user.role !== "admin") {
      filter.published = true;
    }

    // Category filter
    if (category) {
      filter.category = {
        $regex: `^${category}$`,
        $options: "i"
      };
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Sorting
    let sortOption = {};

    if (sort === "price_asc") {
      sortOption.price = 1;
    } else if (sort === "price_desc") {
      sortOption.price = -1;
    } else if (sort === "newest") {
      sortOption.createdAt = -1;
    }

    // Pagination
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));

    const skip = (pageNumber - 1) * limitNumber;

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      products,
      page: pageNumber,
      limit: limitNumber,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limitNumber)
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get products",
      error: error.message
    });
  }
};


// ========================================
// GET SINGLE PRODUCT
// ========================================

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Normal users cannot see unpublished products
    if (
      !product.published &&
      (!req.user || req.user.role !== "admin")
    ) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      product
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get product",
      error: error.message
    });
  }
};


// ========================================
// UPDATE PRODUCT - ADMIN ONLY
// ========================================

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message
    });
  }
};


// ========================================
// DELETE PRODUCT - ADMIN ONLY
// ========================================

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message
    });
  }
};


// ========================================
// PUBLISH PRODUCT - ADMIN ONLY
// ========================================

export const publishProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        published: true
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product published successfully",
      product
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to publish product",
      error: error.message
    });
  }
};


// ========================================
// UNPUBLISH PRODUCT - ADMIN ONLY
// ========================================

export const unpublishProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        published: false
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product unpublished successfully",
      product
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to unpublish product",
      error: error.message
    });
  }
};