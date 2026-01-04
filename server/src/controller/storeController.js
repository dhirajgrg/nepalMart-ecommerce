const Store = require("../models/storeModels");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/usersModels");

exports.createStore = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  const existingStore = await Store.findOne({ owner: req.user._id });
  if (existingStore) {
    return next(new AppError("Store already exists for this vendor", 400));
  }
  const newStore = await Store.create({
    owner: req.user._id,
    name,
    description,
  });


  // link back store to user
  req.user.store = newStore._id;
 await User.findByIdAndUpdate(req.user._id, { store: newStore._id });


  res.status(201).json({
    status: "success",
    message: "Store created successfully",
    data: {
      store: newStore,
    },
  });
});

exports.myStore = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    return next(new AppError("No store found for this vendor", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Store fetched successfully",
    data: {
      store: store,
    },
  });
});

exports.openStore = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    return next(new AppError("No store found for this vendor", 404));
  }
  store.isOpen = !store.isOpen;
  await store.save();

  res.status(200).json({
    status: "success",
    message: "Store opened successfully",
    data: {
      store: store,
    },
  });
});

// =============================================================
exports.storesList = catchAsync(async (req, res, next) => {
  const stores = await Store.find({ isOpen: true }).select(
    "-commissionRate -createdAt -updatedAt -__v"
  );

  res.status(200).json({
    status: "success",
    results: stores.length,
    data: {
      stores: stores,
    },
  });
});

exports.commissionRate = catchAsync(async (req, res, next) => {
  const { storeId } = req.params;
  const store = await Store.findById(storeId);
  if (!store) {
    return next(new AppError("Store not found", 404));
  }
  store.commissionRate = req.body.commissionRate;
  await store.save();
  res.status(200).json({
    status: "success",
    message: "Commission rate updated successfully",
    data: {
      store: store,
    },
  });
});
