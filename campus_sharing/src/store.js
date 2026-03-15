import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import rideReducer from "./rideSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    ride: rideReducer,
  },
});
