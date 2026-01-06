const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Cart = require("../models/cartModels");
const Store = require("../models/storeModels");
const Order = require("../models/orderModels");
const Rider = require("../models/riderModels");

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

exports.getOrderforVendor = catchAsync(async (req, res, next) => {
  console.log("AUTH:", req.user);

  const order = await Order.find({
    store: req.user.store,
    status: { $in: ["CREATED", "ACCEPTED", "PREPARING", "READY"] },
  }).sort({ createdAt: -1 });
  console.log(order);
  if (!order || order.length === 0) {
    return next(new AppError("Order not found", 404));
  }
  res.status(200).json({
    status: "sucess",
    message: "orders fetched successfully",
    data: {
      order,
    },
  });
});

exports.acceptOrderByVendor = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ _id: orderId, store: req.user.store });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  if (order.status !== "CREATED") {
    return next(
      new AppError("Only orders with status CREATED can be accepted", 400)
    );
  }

  order.status = "ACCEPTED";
  await order.save();
  res.status(200).json({
    status: "success",
    message: "Order accepted successfully",
    data: {
      order,
    },
  });
});

exports.rejectOrderByVendor = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ _id: orderId, store: req.user.store });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  if (order.status !== "CREATED") {
    return next(new AppError(" orders cannot be rejected", 400));
  }

  order.status = "REJECTED";
  order.cancelledBy = "VENDOR";
  await order.save();
  res.status(200).json({
    status: "success",
    message: "Order rejected successfully",
    data: {
      order,
    },
  });
});

exports.preparingOrderByVendor = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ _id: orderId, store: req.user.store });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  if (order.status !== "ACCEPTED") {
    return next(
      new AppError("Only orders with status ACCEPTED can be prepared", 400)
    );
  }

  order.status = "PREPARING";
  await order.save();
  res.status(200).json({
    status: "success",
    message: "Order prepared successfully",
    data: {
      order,
    },
  });
});

exports.readyForPickup = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ _id: orderId, store: req.user.store });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  if (order.status !== "PREPARING") {
    return next(
      new AppError(
        "Only orders with status PREPARING can be ready for pickup",
        400
      )
    );
  }

  //order assign to rider logic
  const rider = await Rider.findOne({ isOnline: true, isAvailable: true });
  if (!rider) {
    return next(new AppError("No available riders at the moment", 400));
  }
  
  order.status = "READY";
  order.rider = rider._id;
  rider.currentOrder = order._id;
  rider.isAvailable = false;

  await Promise.all([order.save(), rider.save()]);

  res.status(200).json({
    status: "success",
    message: "Order ready for pickup successfully",
    data: {
      order,
    },
  });
});
