const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getCurrentUser } = require("../controllers/userController");

router.get("/me", auth, getCurrentUser);

module.exports = router;
