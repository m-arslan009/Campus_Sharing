const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "rejected", "accepted"],
    lowercase: true,
    required: true,
    trim: true,
  },
  ride_detail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride",
    required: true,
  },
  booked_by: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

const Requests = mongoose.model("Requests", requestSchema);
module.exports = Requests;
