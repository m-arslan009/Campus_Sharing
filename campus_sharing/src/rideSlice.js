import { createSlice } from "@reduxjs/toolkit";

const RIDE_URI = "http://localhost:5000/rides";

const rideReducer = createSlice({
  name: "Ride",
  initialState: {
    data: [],
  },
  reducers: {
    setRides: (state, action) => {
      state.data = (action.payload || []).map((ride) => ({
        ...ride,
        driver_Name: ride.driver_Name || ride.driver_name,
        avaialble_seats: ride.avaialble_seats ?? ride.available_seats,
        vehical_type: ride.vehical_type || ride.vehicle_type,
        Notes: ride.Notes ?? ride.notes,
      }));
    },

    delRide: (state, action) => {
      state.data = state.data.filter((item) => item._id !== action.payload);
    },

    addRide: (state, action) => {
      const rideWithId = {
        ...action.payload,
        driver_Name: action.payload.driver_Name || action.payload.driver_name,
        avaialble_seats:
          action.payload.avaialble_seats ?? action.payload.available_seats,
        vehical_type:
          action.payload.vehical_type || action.payload.vehicle_type,
        Notes: action.payload.Notes ?? action.payload.notes,
        rideId:
          action.payload.rideId && typeof action.payload.rideId === "string"
            ? action.payload.rideId
            : Date.now().toString() + Math.random().toString(36).substr(2, 8),
      };
      state.data.push(rideWithId);
    },

    updateRideInfo: (state, action) => {
      const { _id, ...rest } = action.payload;
      const rideIdx = state.data.findIndex((r) => r._id === _id);
      if (rideIdx !== -1) {
        state.data[rideIdx] = {
          ...state.data[rideIdx],
          ...rest,
          driver_Name:
            rest.driver_Name ||
            rest.driver_name ||
            state.data[rideIdx].driver_Name,
          avaialble_seats:
            rest.avaialble_seats ??
            rest.available_seats ??
            state.data[rideIdx].avaialble_seats,
          vehical_type:
            rest.vehical_type ||
            rest.vehicle_type ||
            state.data[rideIdx].vehical_type,
          Notes: rest.Notes ?? rest.notes ?? state.data[rideIdx].Notes,
        };
      }
    },
  },
});

export const createNewRide = (rideData) => async (dispatch) => {
  try {
    const response = await fetch(RIDE_URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rideData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(addRide(data.ride));
    return data.message;
  } catch (error) {
    throw error;
  }
};

export const getAllRides = () => async (dispatch) => {
  try {
    const response = await fetch(RIDE_URI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(setRides(data.allRides));
    return data.message || "Rides fetched successfully";
  } catch (error) {
    throw error;
  }
};

export const updateRide = (rideData) => async (dispatch) => {
  try {
    const { _id, ...rest } = rideData;
    const response = await fetch(`${RIDE_URI}/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rest),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(updateRideInfo(data.ride));
    return data.message;
  } catch (error) {
    throw error;
  }
};

export const deleteRide = (rideId) => async (dispatch) => {
  try {
    const response = await fetch(`${RIDE_URI}/${rideId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    dispatch(delRide(rideId));
    return "Ride Deleted Successfully";
  } catch (error) {
    throw error;
  }
};

export const { delRide, addRide, setRides, updateRideInfo } =
  rideReducer.actions;
export default rideReducer.reducer;
