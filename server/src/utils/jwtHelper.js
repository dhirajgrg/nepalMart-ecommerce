const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.jwtTokenGenerator = async (id) => {
  return await promisify(jwt.sign)({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

exports.jwtTokenVerify = async (token) => {
  return promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
};
