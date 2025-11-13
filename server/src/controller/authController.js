const crypto = require("crypto");
const User = require("../models/usersModels");
const catchAsync = require("../utils/catchAsync");
const { jwtTokenGenerator } = require("../utils/jwtHelper");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

// SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    role,
  });

  const token = await jwtTokenGenerator(newUser._id);

  newUser.password = undefined;

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    status: "success",
    message: "User signed up successfully",
    token,
    data: {
      user: newUser,
    },
  });
});

//  LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  // find user based on email
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new AppError("Incorrect email or password", 401));

  // token generator
  const token = await jwtTokenGenerator(user._id);

  // hide password
  user.password = undefined;

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
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

//  LOGOUT
exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

//  FORGOT PASSWORD
exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // find user based on email
  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError("No user found with this email address", 404));

  // reset token generator
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  // message
  const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetUrl}.\nIf you didn’t request a password reset, please ignore this email.`;

  // send email
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

// reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // hashed token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // find user based on token and token expires
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) return next(new AppError("invalid token or token expires", 400));

  // update password from body
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  // generate token
  const token = await jwtTokenGenerator(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // send res
  res.status(200).json({
    status: "success",
    message: "Password reset successful",
    token,
    user,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

   const token = await jwtTokenGenerator(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    message: "Password reset successful",
    token,
    user,
  });
});
