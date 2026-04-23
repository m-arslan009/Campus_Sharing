import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import rideReducer from "./rideSlice";
import requestReducer from "./requestSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    ride: rideReducer,
    request: requestReducer,
  },
});
