const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Cart = require("../models/cartModels");
const Store = require("../models/storeModels");
const Order=require("../models/orderModels")


exports.createOrder = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ customer: req.user._id });
  if (!cart || cart.items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  const store = await Store.findById(cart.store);
  if (!store || !store.isOpen) {
    return next(new AppError("Store is closed or unavailable", 400));
  }

  let subtotal = 0;
  subtotal = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    customer: req.user._id,
    store: cart.store,
    items: cart.items,
    subtotal,
  });

  // clear the cart after creating order
  cart.items = [];
  await cart.save();
  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: {
      order,
    },
  });
});

exports.getOrdersForStore = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    return next(new AppError("Store not found for this vendor", 404));
  }
  const orders = await Order.find({ store: store._id });
  res.status(200).json({
    status: "success",
    message: "Orders retrieved successfully",
    data: {
      orders,
    },
  });
});
