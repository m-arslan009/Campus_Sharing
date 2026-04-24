const express = require("express");
const { jwtAuth } = require("../Middleware/sessionAuthentication");
const {
  createNewRide,
  updateRide,
  getAllRides,
  getRide,
  deleteRide,
} = require("../Controllers/rideControler");
const router = express.Router();

router.post("/", jwtAuth, createNewRide);
router.put("/:id", jwtAuth, updateRide);
router.get("/", getAllRides);
router.get("/:id", getRide);
router.delete("/:id", jwtAuth, deleteRide);
module.exports = router;
