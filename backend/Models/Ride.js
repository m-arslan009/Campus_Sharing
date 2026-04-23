const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  rideId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^\d+$/,
  },
  driver_name: {
    type: String,
    alias: "driver_Name",
    required: true,
    trim: true,
    match: /^[a-zA-Z ]+$/,
  },
  pickup_location: {
    type: String,
    required: true,
    trim: true,
    match: /^[a-zA-Z0-9 ,.-]+$/,
  },
  drop_location: {
    type: String,
    required: true,
    trim: true,
    match: /^[a-zA-Z0-9 ,.-]+$/,
  },
  departure_time: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    match: /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/,
  },
  available_seats: {
    type: Number,
    alias: "avaialble_seats",
    required: true,
    min: 1,
    max: 50,
  },
  vehicle_type: {
    type: String,
    alias: "vehical_type",
    required: true,
    trim: true,
    enum: ["Sedan", "SUV", "Hatchback", "Van", "Bike", "Other"],
  },
  contact_information: {
    type: String,
    required: true,
    trim: true,
    match: /^(?:\+92|92|0)?3[0-9]{2}[\s-]?[0-9]{7}$/,
  },
  notes: {
    type: String,
    alias: "Notes",
    trim: true,
    maxlength: 300,
  },
  posted_by: {
    type: String,
    required: true,
    trim: true,
    match: /^[a-zA-Z ]+$/,
  },
  posted_person_email: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Ride = mongoose.model("Ride", rideSchema);
module.exports = Ride;
