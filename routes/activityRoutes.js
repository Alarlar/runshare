const express = require("express");
const router = express.Router();
// Импортируем middleware для проверки JWT
const authMiddleware = require("../middleware/auth");

const {
  createActivity,
  getActivities,
  deleteActivity,
} = require("../controllers/activityController");

// 1. Публичный роут: все могут просматривать маршруты
router.get("/", getActivities);

// 2. Защищенные роуты: только для залогиненных пользователей
// Добавляем authMiddleware перед контроллерами
router.post("/", authMiddleware, createActivity);
router.delete("/:id", authMiddleware, deleteActivity);

module.exports = router;
