const User = require("../models/usersModels");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { jwtTokenGenerator } = require("../utils/jwtHelper"); 

// User Controller

// Update My Password
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // Update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  const token = await jwtTokenGenerator(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
    token,
    data: { user },
  });
});

// Update Me (update user profile except password)
exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if user tries to update password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // Filtered body with allowed fields
  const filteredBody = {};
  const allowedFields = ["name", "email"];
  Object.keys(req.body).forEach((el) => {
    if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
  });

  // Update user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: { user: updatedUser },
  });
});

// Delete Me (soft delete by setting 'active' to false)
exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    message: "User deleted successfully",
    data: null,
  });
});

// Get Me (fetch the logged-in user)
exports.getMe = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError("User not found or not logged in", 401));
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

// Admin Controller

// Get All Users (admin only)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    message: "Users fetched successfully",
    data: { users },
  });
});

// Get Specific User (by ID) (admin only)
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User fetched successfully",
    data: { user },
  });
});

// Update User (admin only)
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: { user },
  });
});

// Delete User (admin only)
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    message: "User deleted successfully",
    data: null,
  });
});
