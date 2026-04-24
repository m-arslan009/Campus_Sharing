const express = require("express");
const { jwtAuth } = require("../Middleware/sessionAuthentication");
const {
  createNewRequests,
  updateRequest,
  getAllRequests,
  getRequestQueueByUser,
  getRequest,
  deleteRequest,
  deleteRequestsByRideId,
} = require("../Controllers/requestController");
const router = express.Router();

router.post("/", jwtAuth, createNewRequests);
router.put("/:id", jwtAuth, updateRequest);
router.get("/", jwtAuth, getAllRequests);
router.get("/users/:userId/queue", jwtAuth, getRequestQueueByUser);
router.delete("/ride/:rideId", jwtAuth, deleteRequestsByRideId);
router.get("/:id", jwtAuth, getRequest);
router.delete("/:id", jwtAuth, deleteRequest);


module.exports = router;
