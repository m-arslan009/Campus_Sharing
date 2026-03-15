import { createSlice } from "@reduxjs/toolkit";

const rideReducer = createSlice({
  name: "Ride",
  initialState: {
    data: [
      {
        rideId: "1",
        driver_Name: "Ali Hassan",
        pickup_location: "Lahore",
        drop_location: "Islamabad",
        departure_time: "10:00 AM",
        avaialble_seats: 3,
        vehical_type: "SUV",
        contact_information: "123-456-7890",
        Notes: "No pets allowed",
        posted_by: "Ali Hassan",
        posted_person_email: "ali.hassan@gmail.com",
      },
      {
        rideId: "2",
        driver_Name: "Sara Khan",
        pickup_location: "Lahore",
        drop_location: "Peshawar",
        departure_time: "01:00 PM",
        avaialble_seats: 2,
        vehical_type: "Sedan",
        contact_information: "987-654-3210",
        Notes: "Snacks allowed",
        posted_by: "Sara Khan",
        posted_person_email: "sara.khan@gmail.com",
      },
      {
        rideId: "3",
        driver_Name: "Zeeshan Rana",
        pickup_location: "Islamabad",
        drop_location: "Lahore",
        departure_time: "03:00 PM",
        avaialble_seats: 1,
        vehical_type: "Hatchback",
        contact_information: "555-555-5555",
        Notes: "No smoking",
        posted_by: "Zeeshan Rana",
        posted_person_email: "zeeshan.rana@gmail.com",
      },
    ],
    booking: [
      {
        rideId: "1",
        requestId: "req-1",
        pickup_location: "Lahore",
        drop_location: "Islamabad",
        departure_time: "10:00 AM",
        contact_information: "123-456-7890",
        status: "Pending",
        booked_by: "abc123@gmail.com",
      },
      {
        rideId: "2",
        requestId: "req-2",
        pickup_location: "Lahore",
        drop_location: "Peshawar",
        departure_time: "01:00 PM",
        contact_information: "987-654-3210",
        status: "Accepted",
        booked_by: "abc123@gmail.com",
      },
      {
        rideId: "3",
        requestId: "req-3",
        pickup_location: "Islamabad",
        drop_location: "Lahore",
        departure_time: "03:00 PM",
        contact_information: "555-555-5555",
        status: "Rejected",
        booked_by: "ali.hassan@gmail.com",
      },
    ],
    bookingQueue: [
      {
        rideId: "1",
        requestId: "req-1",
        pickup_location: "Lahore",
        drop_location: "Islamabad",
        departure_time: "10:00 AM",
        contact_information: "123-456-7890",
        status: "Pending",
        booked_by: "abc123@gmail.com",
      },
      {
        rideId: "3",
        requestId: "req-3",
        pickup_location: "Islamabad",
        drop_location: "Lahore",
        departure_time: "03:00 PM",
        contact_information: "555-555-5555",
        status: "Rejected",
        booked_by: "ali.hassan@gmail.com",
      },
    ],
  },
  reducers: {
    deleteRide: (state, action) => {
      return state.filter((item) => item.rideId !== action.payload);
    },

    addRide: (state, action) => {
      const rideWithId = {
        ...action.payload,
        rideId:
          action.payload.rideId && typeof action.payload.rideId === "string"
            ? action.payload.rideId
            : Date.now().toString() + Math.random().toString(36).substr(2, 8),
      };
      state.data.push(rideWithId);
    },

    addBooking: (state, action) => {
      state.booking.push(action.payload);

      const ride = state.data.find((r) => r.rideId === action.payload.rideId);
      if (ride && ride.avaialble_seats > 0) {
        ride.avaialble_seats--;
      }
    },

    deleteBooking: (state, action) => {
      return state.booking.filter((item) => item.rideId !== action.payload);
    },

    addRidesInQueue: (state, action) => {
      const requestWithId = {
        ...action.payload,
        requestId:
          action.payload.requestId &&
          typeof action.payload.requestId === "string"
            ? action.payload.requestId
            : Date.now().toString() + Math.random().toString(36).substr(2, 8),
        status: action.payload.status || "Pending",
        booked_by: JSON.parse(sessionStorage.getItem("user")).email,
      };
      state.booking.push(requestWithId);
      state.bookingQueue.push(requestWithId);
    },

    acceptRideRequest: (state, action) => {
      const idx = state.bookingQueue.findIndex(
        (ride) => ride.requestId === action.payload,
      );
      if (idx !== -1) {
        state.booking[idx].status = "Accepted";
        state.bookingQueue.pop(idx);
      }
    },

    rejectRideRequest: (state, action) => {
      const idx = state.bookingQueue.findIndex(
        (ride) => ride.requestId === action.payload,
      );
      if (idx !== -1) {
        state.booking[idx].status = "Rejected";
        state.bookingQueue.pop(idx);
      }
    },
  },
});

export const {
  deleteRide,
  addRide,
  addBooking,
  deleteBooking,
  addRidesInQueue,
  acceptRideRequest,
  rejectRideRequest,
} = rideReducer.actions;
export default rideReducer.reducer;
