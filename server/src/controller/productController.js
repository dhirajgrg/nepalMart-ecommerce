const Product = require("../models/produictModels");
const Store = require("../models/storeModels");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createProduct = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    return next(new AppError("You do not have a store yet", 400));
  }
  const { name, description, price, isAvailable } = req.body;
  const product = await Product.create({
    store: store._id,
    name,
    description,
    price,
    isAvailable,
  });
  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.myProduct = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    return next(new AppError("You do not have a store yet", 400));
  }
  const products = await Product.find({ store: store._id });
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    return next(new AppError("You do not have a store yet", 400));
  }
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, store: store._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) {
    return next(
      new AppError("No product found with that ID for your store", 404)
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.getProductsByStore = catchAsync(async (req, res, next) => {
  const store = await Store.findById(req.params.storeId);
  if (!store || !store.isOpen) {
    return next(new AppError("No store found with that ID or store is closed", 404));
  }
  const products = await Product.find({ store: store._id });
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});
