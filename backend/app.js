const express = require("express");
require("dotenv").config();
const cors = require("cors");
const ConnectDB = require("./db");
const userRouter = require("./Routers/userRouter");
const rideRouter = require("./Routers/rideRouter");
const requestRouter = require("./Routers/requestsRouter");
const bookingsRouter = require("./Routers/bookingsRouter");

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";
const ALLOWED_ORIGINS = [FRONTEND_ORIGIN, "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
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
