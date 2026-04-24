const express = require("express");
const { jwtAuth } = require("../Middleware/sessionAuthentication");
const { getBookingsByUser } = require("../Controllers/requestController");

const router = express.Router();

router.get("/users/:userId", jwtAuth, getBookingsByUser);
module.exports = router;
