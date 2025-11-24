const AppError = require("../utils/appError");
const Product = require("../models/productsModels");
const catchAsync = require("../utils/catchAsync");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().populate("vendor", "name email");
  if (!products || products.length === 0)
    return new AppError("no products found", 404);
  res.status(200).json({
    status: "success",
    message: "users fetch successfully",
    data: {
      products,
    },
  });
});

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
  if (!product) return res.status(404).json({ message: "Product not found" });

  res
    .status(200)
    .json({ status: "success", message: "product approved successfully" });
});

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
  if (!product) return res.status(404).json({ message: "Product not found" });

  res
    .status(200)
    .json({ status: "success", message: "product rejected successfully" });
});
