
const AppError = require("../utils/appError");

exports.restrictTo = (...roles) => {
  // Admin, Vendor, Customer roles, etc.
  return (req, res, next) => {
    // Check if the user role is allowed to access this route
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Access denied! ",
          403
        )
      );
    }
    next();
  };
};
