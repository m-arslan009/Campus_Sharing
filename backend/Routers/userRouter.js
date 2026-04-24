const express = require("express");
const userRouter = express.Router();
const { jwtAuth } = require("../Middleware/sessionAuthentication");

const {
  RegisterUser,
  getUsers,
  getUser,
  updateUserProfile,
  login,
  deleteUser,
  updateUserStatus,
  logout
} = require("../Controllers/userController");

userRouter.post("/register", RegisterUser);
userRouter.post("/login", login);

userRouter.get("/", jwtAuth, getUsers);
userRouter.get("/:email", jwtAuth, getUser);

userRouter.put("/status/:email", jwtAuth, updateUserStatus);
userRouter.put("/:id", jwtAuth, updateUserProfile);

userRouter.delete("/:id", jwtAuth, deleteUser);
userRouter.post("/logout", logout);

module.exports = userRouter;
