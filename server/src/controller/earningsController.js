const Transaction = require("../models/transactionModels");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getVendorEarnings = catchAsync(async (req, res, next) => {
  const earnings = await Transaction.find({ vendor: req.user._id }).select(
    "amounts.vendorEarning amounts.itemsTotal createdAt"
  );
  console.log("vendor earninrs:", earnings);
  if (!earnings) {
    return next(new AppError("Not any earnings yet", 404));
  }
  res.status(200).json({
    status: "success",
    message: "successfull fetched earnings",
    data: earnings,
  });
});
exports.getRiderEarnings = catchAsync(async (req, res, next) => {
  const earnings = await Transaction.find({ rider: req.user._id }).select(
    "amounts.riderEarning amounts.itemsTotal createdAt"
  );
  if (!earnings) {
    return next(new AppError("Not any earnings yet", 404));
  }
  res.status(200).json({
    status: "success",
    message: "successfull fetched earnings",
    data: earnings,
  });
});
exports.getPlatformEarnings = catchAsync(async (req, res, next) => {
  const stats = await Transaction.aggregate([
    {
      $group: {
        _id: null,
        totalPlatformEarning: { $sum: "$amounts.platformEarning" },
        totalVendorEarning: { $sum: "$amounts.vendorEarning" },
        totalRiderEarning: { $sum: "$amounts.riderEarning" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    message: "successfull fetched earnings",
    data: stats[0] || {},
  });
});
