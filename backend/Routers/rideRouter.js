const express = require("express");
const {
  createNewRide,
  updateRide,
  getAllRides,
  getRide,
  deleteRide,
} = require("../Controllers/rideControler");
const router = express.Router();

router.post("/", createNewRide);
router.put("/:id", updateRide);
router.get("/", getAllRides);
router.get("/:id", getRide);
router.delete("/:id", deleteRide);

module.exports = router;
