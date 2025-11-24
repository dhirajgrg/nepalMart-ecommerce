const { jwtTokenVerify } = require("../utils/jwtHelper");
const User = require("../models/usersModels");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Not authorized, token missing in cookies",
    });
  }

  const decoded = await jwtTokenVerify(token);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: "fail",
      message: "User no longer exists",
    });
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    next(new AppError("password changed recently. Please log in again.", 401));
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  //admin
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "denied this operation!! only admin or vendor can perform this action",
          403
        )
      );
    }
    next();
  };
};
