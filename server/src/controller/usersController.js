const User = require("../models/usersModels");
const catchAsync = require("../utils/catchAsync");


// get all user
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    message: "All users fetch successfully",
    usersLength: users.length,
    data: users,
  });
});


// get user
exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json({
    status: "success",
    message: " users fetch successfully",
    data: user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, email } = req.body;

  // Update user
  const user = await User.findByIdAndUpdate(
    id,
    { name, email },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: user, 
  });
});

// delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    message: " users deleted successfully",
  });
});
