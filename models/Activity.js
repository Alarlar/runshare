const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
    type: {
      type: String,
      enum: ["run", "walk", "bike", "ski", "cycle"],
      required: [true, "Please provide activity type"],
    },
    distance: {
      type: Number,
      required: [true, "Please provide distance"],
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    // Структура [[lat, lng], [lat, lng]] идеально подходит для Leaflet или Google Maps
    path: {
      type: [[Number]],
      required: [true, "Please provide coordinates path"],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
