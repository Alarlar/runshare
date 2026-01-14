require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const connectDB = require("./db/connect");

// Импорт роутов
const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");
const userRoutes = require("./routes/userRoutes"); // Твой новый роут

// Middleware
app.use(express.json());
app.use(express.static("./public"));

// Роуты API
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/users", userRoutes); // Подключаем роут профиля

// Обработка ошибок (убедись, что эти файлы у тебя есть)
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5008;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("🚀 Connected to MongoDB");
    app.listen(port, () =>
      console.log(`🌍 Server is running on port ${port}...`)
    );
  } catch (error) {
    console.log("❌ DB Connection Error:", error);
  }
};

start();
