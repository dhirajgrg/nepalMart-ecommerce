const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Cart = require("../models/cartModels");
const Store = require("../models/storeModels");
const Product = require("../models/productModels");

exports.createCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId).populate("store");
  if (!product || !product.store || !product.store.isOpen) {
    return next(
      new AppError("Product is not available or store is closed", 400)
    );
  }

  const cart = await Cart.findOne({ customer: req.user._id });
  if (!cart) {
    
    await Cart.create({
      customer: req.user._id,
      store: product.store._id,
      items: [],
    });
  }

  if (cart.store.toString() !== product.store._id.toString()) {
    return next(
      new AppError(
        "Cannot add products from different stores to the same cart",
        400
      )
    );
  }
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
    });
  }
  await cart.save();

  res.status(201).json({
    status: "success",
    message: "Product added to cart successfully",
    data: {
      cart,
    },
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ customer: req.user._id }).populate(
    "items.product"
  );
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Cart retrieved successfully",
    data: {
      cart,
    },
  });
});
exports.deleteCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ customer: req.user._id }).populate(
    "items.product"
  );
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Cart deleted successfully",
  });
});
