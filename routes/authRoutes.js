const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");

// Публичные роуты для входа и регистрации
router.post("/register", register);
router.post("/login", login);

// Роут для логаута (клиент просто получит подтверждение и удалит токен у себя)
router.get("/logout", logout);

module.exports = router;
