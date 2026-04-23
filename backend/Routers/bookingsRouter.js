const express = require("express");
const { getBookingsByUser } = require("../Controllers/requestController");

const router = express.Router();

router.get("/users/:userId", getBookingsByUser);

module.exports = router;
