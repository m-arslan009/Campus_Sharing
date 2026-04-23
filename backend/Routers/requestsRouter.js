const express = require("express");
const {
  createNewRequests,
  updateRequest,
  getAllRequests,
  getRequestQueueByUser,
  getRequest,
  deleteRequest,
} = require("../Controllers/requestController");
const router = express.Router();

router.post("/", createNewRequests);
router.put("/:id", updateRequest);
router.get("/", getAllRequests);
router.get("/users/:userId/queue", getRequestQueueByUser);
router.get("/:id", getRequest);
router.delete("/:id", deleteRequest);

module.exports = router;
