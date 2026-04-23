const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      select: false,
    },
    status: {
      type: String,
      enum: ["active", "block"],
      default: "active",
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["student", "organizer"],
      required: true,
      lowercase: true,
    },
  },
  {
    collection: "users",
  },
);

module.exports = mongoose.model("User", UserSchema);
