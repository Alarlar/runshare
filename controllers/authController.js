const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide name, email and password");
  }

  const user = await User.create({ name, email, password });

  // Создаем токен (метод createJWT добавим в модель User)
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    msg: "Registered successfully",
    user: { name: user.name },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  // Создаем токен при успешном входе
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    msg: "Logged in successfully",
    user: { name: user.name },
    token,
  });
};

const logout = async (req, res) => {
  // При использовании JWT выход происходит на стороне клиента (удаление токена).
  // Серверу просто достаточно подтвердить запрос.
  res.status(StatusCodes.OK).json({ msg: "Logged out" });
};

module.exports = { register, login, logout };
