const Product = require("../models/productsModels");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// CREATE PRODUCT
exports.createProduct = catchAsync(async (req, res, next) => {
  const { title, price } = req.body;

  if (!title || !price)
    return next(new AppError("Title and price are required", 400));

  const newProduct = await Product.create({
    title,
    price,
    vendor: req.user._id,  // Ensure the logged-in user is set as the vendor
  });

  res.status(201).json({
    status: "success",
    message: "New product has been created successfully.",
    product: newProduct,
  });
});

// GET MY ALL PRODUCTS (for a specific vendor)
exports.getMyAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ vendor: req.user._id });  // Fixed field name to 'vendor'

  if (!products || products.length === 0)
    return next(new AppError("No products found for this vendor", 404));

  res.status(200).json({
    status: "success",
    message: "All products fetched successfully",
    data: { products },
  });
});

// GET MY PRODUCT (for a specific product)
exports.getMyProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) return next(new AppError("Product not found with this ID", 404));

  res.status(200).json({
    status: "success",
    message: "Product fetched successfully",
    data: { product },
  });
});

// DELETE MY PRODUCT (for a specific product)
exports.deleteMyProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);
  if (!product) return next(new AppError("Product not found with this ID", 404));

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});

// UPDATE MY PRODUCT (for a specific product)
exports.updateMyProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Filter the request body to only allow specific fields for updating
  const filteredBody = {};
  const allowedUpdates = ["title", "price"];

  Object.keys(req.body).forEach((el) => {
    if (allowedUpdates.includes(el)) filteredBody[el] = req.body[el];
  });

  const product = await Product.findByIdAndUpdate(id, filteredBody, {
    new: true,
    runValidators: true,
  });
  
  if (!product) return next(new AppError("Product not found with this ID", 404));

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: { product }, // Send the updated product as response
  });
});


//public products for view
// GET APPROVED PRODUCTS (for customers to view approved products)
exports.getApprovedProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ status: "approved" });

  if (!products || products.length === 0)
    return next(new AppError("No approved products found", 404));

  res.status(200).json({
    status: "success",
    message: "Approved products fetched successfully",
    data: { products },
  });
});
exports.getRejectedProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ status: "rejected" });

  if (!products || products.length === 0)
    return next(new AppError("No approved products found", 404));

  res.status(200).json({
    status: "success",
    message: "Rejected products fetched successfully",
    data: { products },
  });
});
