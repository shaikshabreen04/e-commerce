import Product from "../models/Product.js";

// ========================================
// CREATE PRODUCT - ADMIN ONLY
// ========================================

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      published
    } = req.body;

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
// PUBLIC
// ONLY PUBLISHED PRODUCTS
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

    // Only published products are visible publicly
    const filter = {
      published: true
    };

    // ========================================
    // CATEGORY FILTER
    // ========================================

    if (category) {
      filter.category = {
        $regex: `^${category}$`,
        $options: "i"
      };
    }

    // ========================================
    // PRICE FILTER
    // ========================================

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // ========================================
    // SORTING
    // ========================================

    let sortOption = {};

    if (sort === "price_asc") {
      sortOption.price = 1;
    } else if (sort === "price_desc") {
      sortOption.price = -1;
    } else if (sort === "newest") {
      sortOption.createdAt = -1;
    }

    // ========================================
    // PAGINATION
    // ========================================

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));

    const skip = (pageNumber - 1) * limitNumber;

    // Count matching products
    const totalProducts = await Product.countDocuments(filter);

    // Get products
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    // ========================================
    // RESPONSE
    // ========================================

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
// PUBLIC
// ONLY PUBLISHED PRODUCTS
// ========================================

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // Product doesn't exist
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Unpublished products are not publicly visible
    if (!product.published) {
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
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

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