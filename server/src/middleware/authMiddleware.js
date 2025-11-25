const { jwtTokenVerify } = require("../utils/jwtHelper");
const User = require("../models/usersModels");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.protect = catchAsync(async (req, res, next) => {
  // Step 1: Extract token from cookies
  const token = req.cookies.token;
  if (!token) {
    return next(new AppError("Invalid token", 401));
  }

  // Step 2: Verify and decode the token
  let decoded;
  try {
    decoded = await jwtTokenVerify(token);
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }

  // Step 3: Check if user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("User no longer exists", 404));
  }

  // Step 4: Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("Password changed recently. Please log in again.", 401)
    );
  }

  // Step 5: Attach user to request object
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  // Admin, Vendor, Customer roles, etc.
  return (req, res, next) => {
    // Check if the user role is allowed to access this route
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Access denied! Only admin or vendor can perform this action",
          403
        )
      );
    }
    next();
  };
};
