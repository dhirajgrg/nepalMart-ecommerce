const Product = require("../models/productsModels");
const { find } = require("../models/usersModels");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createProduct = catchAsync(async (req, res, next) => {
  const { title, price } = req.body;
  if (!title || !price) return new AppError("title or price required", 400);

  const newProduct = await Product.create({
    title,
    price,
    vendor: req.user._id,
  });
  res.status(201).json({
    status: "success",
    message: "new product has been created successfully.",
    products: newProduct,
  });
});

exports.getMyAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ vendorID: req.user._id });
  if (!products || products.length === 0)
    return new AppError("products not found for this vendor", 404);

  res.status(200).json({
    status: "success",
    message: "all products fetched successfully",
    data: {
      products,
    },
  });
});

exports.getMyProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) return new AppError("products not found with this id", 404);

  res.status(200).json({
    status: "success",
    message: "successfully fecth product",
    data: {
      product,
    },
  });
});
exports.DeleteMyProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);
  if (!product) return new AppError("products not found with this id", 404);

  res.status(200).json({
    status: "success",
    message: "product deleted successfully",
  });
});
exports.UpdateMyProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const filteredBody = {};
  const allowedUpdates = ["title", "price"];

  Object.keys(req.body).forEach((el) => {
    if (allowedUpdates.includes(el)) filteredBody[el] = req.body[el];
  });

  const product = await Product.findByIdAndUpdate(id, filteredBody, {
    new: true,
    runValidators: true,
  });
  if (!product) return new AppError("products not found with this id", 404);

  res.status(200).json({
    status: "success",
    message: " product updated sucessfully",
  });
});

// for customers
exports.getApprovedProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ status: "approved" });
  if (!products) return new AppError("no products found", 404);
  res.status(200).json({
    status: "success",
    message: "products fetched successfully",
    data: {
      products,
    },
  });
});

