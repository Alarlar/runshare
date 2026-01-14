const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const getCurrentUser = async (req, res) => {
  // Достаем userId, который мы положили в req.user в middleware auth.js
  const user = await User.findById(req.user.userId).select("-password");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(StatusCodes.OK).json({ success: true, user });
};

module.exports = { getCurrentUser };
