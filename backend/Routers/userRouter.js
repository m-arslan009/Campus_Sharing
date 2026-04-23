const express = require("express");
const userRouter = express.Router();
const {
  RegisterUser,
  getUsers,
  getUser,
  updateUserProfile,
  login,
  deleteUser,
  updateUserStatus,
} = require("../Controllers/userController");

userRouter.post("/register", RegisterUser);
userRouter.post("/login", login);

userRouter.get("/", getUsers);
userRouter.get("/:email", getUser);

userRouter.put("/status/:email", updateUserStatus);
userRouter.put("/:id", updateUserProfile);

userRouter.delete("/:id", deleteUser);

module.exports = userRouter;
