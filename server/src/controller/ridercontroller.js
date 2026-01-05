const Rider = require("../models/riderModels");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Order = require("../models/orderModels");

exports.goOnline = catchAsync(async (req, res, next) => {
  console.log(req.user)
  const rider = await Rider.findOne({ user: req.user._id });
  if (!rider) {
    return next(new AppError("Rider profile not found", 404));
  }

  rider.isOnline = true;
  rider.isAvailable = true;

  await rider.save();

  res.status(200).json({ status: "success", message: "Rider is online" });
});

exports.goOffline = catchAsync(async (req, res, next) => {
  const rider = await Rider.findOne({ user: req.user._id });
  if (!rider) {
    return next(new AppError("Rider profile not found", 404));
  }

  if (rider.currentOrder) {
    return next(new AppError("Cannot go offline during active order", 400));
  }

  rider.isOnline = false;
  rider.isAvailable = false;

  await rider.save();

  res.status(200).json({ status: "success", message: "Rider is offline" });
});

exports.acceptOrder = catchAsync(async (req, res, next) => {
  const rider = await Rider.findOne({ user: req.user._id });
  const order = await Order.findById(req.params.orderId);

  if (!order || order.rider.toString() !== rider._id.toString()) {
    return next(new AppError("Order not assigned to you", 403));
  }

  res.status(200).json({ status: "success", message: "Order accepted" });
});

exports.pickupOrder = catchAsync(async (req, res, next) => {
  const rider = await Rider.findOne({ user: req.user._id });
  const order = await Order.findById(req.params.orderId);

  order.status = "PICKED";
  await order.save();

  res.status(200).json({ status: "success", message: "Order picked up" });
});

exports.deliverOrder = catchAsync(async (req, res, next) => {
  const rider = await Rider.findOne({ user: req.user._id });
  const order = await Order.findById(req.params.orderId);

  order.status = "DELIVERED";
  rider.currentOrder = null;
  rider.isAvailable = true;

  await Promise.all([order.save(), rider.save()]);

  res.status(200).json({ status: "success", message: "Order delivered" });
});

exports.getCurrentOrder = catchAsync(async (req, res, next) => {
  const rider = await Rider.findOne({ user: req.user._id }).populate(
    "currentOrder"
  );
  if (!rider) {
    return next(new AppError("Rider profile not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Current order retrieved",
    currentOrder: rider.currentOrder,
  });
});
