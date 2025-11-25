const AppError = require("../utils/appError");
const Product = require("../models/productsModels");
const catchAsync = require("../utils/catchAsync");

// Get All Products
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().populate("vendor", "name email");
  if (!products || products.length === 0) {
    return next(new AppError("No products found", 404));
  }
  
  res.status(200).json({
    status: "success",
    message: "Products fetched successfully",
    data: {
      products,
    },
  });
});

// Approve Product
exports.approvedProducts = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(
    id,
    { status: "approved" },
    {
      new: true,
      runValidators: true,
    }
  );
  
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product approved successfully",
  });
});

// Reject Product
exports.rejectedProducts = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(
    id,
    { status: "rejected" },
    {
      new: true,
      runValidators: true,
    }
  );
  
  if (!product) {
    return next(new AppError("Product not found", 404)); 
  }

  res.status(200).json({
    status: "success",
    message: "Product rejected successfully",
  });
});
