const crypto = require("crypto");
const User = require("../models/usersModels");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../services/email");
const { jwtTokenGenerator } = require("../utils/jwtHelper");

// SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return next(new AppError("All fields are required", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    confirmPassword,
    role,
  });

  res.status(201).json({
    status: "success",
    data: { user },
  });
});

// LOGIN
exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  // Find user based on email
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // Generate JWT Token
  const token = await jwtTokenGenerator(user._id);

  // Hide password in the response
  user.password = undefined;

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    token,
    data: {
      user,
    },
  });
});

// LOGOUT
exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

// FORGOT PASSWORD
exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Find user based on email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("No user found with this email address", 404));
  }

  // Generate password reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Generate reset URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  // Message to be sent in the email
  const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetUrl}.\nIf you didn’t request a password reset, please ignore this email.`;

  // Send the email
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Please try again later.",
        500
      )
    );
  }
});

// RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Hash the token from URL params
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Find user by token and check token expiration
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user)
    return next(new AppError("Invalid token or token has expired", 400));

  // Update the user's password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  // Generate a new JWT Token
  const token = await jwtTokenGenerator(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    message: "Password reset successful",
    token,
    user,
  });
});
