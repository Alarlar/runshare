const Activity = require("../models/Activity");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");

const createActivity = async (req, res) => {
  // Данные о юзере теперь берем из req.user (из JWT токена)
  const { type, distance, points } = req.body;

  if (!type || !points || points.length < 2) {
    throw new BadRequestError(
      "Please provide type, distance and at least 2 points"
    );
  }

  const activity = await Activity.create({
    user: req.user.userId, // Используем userId из токена
    type,
    distance,
    path: points,
  });

  res.status(StatusCodes.CREATED).json({ activity });
};

const getActivities = async (req, res) => {
  // Видят все пользователи
  const activities = await Activity.find({})
    .populate("user", "name") // Подтягиваем имя создателя
    .sort("-createdAt");

  res.status(StatusCodes.OK).json({ activities });
};

const deleteActivity = async (req, res) => {
  const { id: activityId } = req.params;
  const userId = req.user.userId;

  const activity = await Activity.findById(activityId);

  if (!activity) {
    throw new NotFoundError(`No activity with id ${activityId}`);
  }

  // Проверка: удалять может только тот, кто создал
  if (activity.user.toString() !== userId) {
    throw new UnauthenticatedError("Not authorized to delete this activity");
  }

  await activity.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Activity deleted successfully" });
};

module.exports = { createActivity, getActivities, deleteActivity };
