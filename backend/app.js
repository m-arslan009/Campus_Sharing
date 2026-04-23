const express = require("express");
require("dotenv").config();
const cors = require("cors");
const ConnectDB = require("./db");
const userRouter = require("./Routers/userRouter");
const rideRouter = require("./Routers/rideRouter");
const requestRouter = require("./Routers/requestsRouter");
const bookingsRouter = require("./Routers/bookingsRouter");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server running" });
});

app.use("/users", userRouter);
app.use("/rides", rideRouter);
app.use("/bookings", bookingsRouter);
app.use("/requests", requestRouter);

async function startServer() {
  await ConnectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
