import { createSlice } from "@reduxjs/toolkit";

const REQUEST_URI = "http://localhost:5000/requests";
const BOOKINGS_URI = "http://localhost:5000/bookings";

const mapRequestForClient = (request = {}) => ({
  ...request,
  rideId:
    request.rideId || request.ride_detail?._id || request.ride_detail || "",
  requestId: request.requestId || request._id || "",
  status: request.status || "pending",
  booked_by:
    request.booked_by || request.bookedBy || request.requested_by || "",
});

const requestSlice = createSlice({
  name: "request",
  initialState: {
    booking: [],
    bookingQueue: [],
  },
  reducers: {
    setRequests: (state, action) => {
      state.booking = (action.payload || []).map(mapRequestForClient);
      state.bookingQueue = state.booking.filter(
        (request) => request.status === "pending",
      );
    },

    setBookings: (state, action) => {
      state.booking = (action.payload || []).map(mapRequestForClient);
    },

    setBookingQueus: (state, action) => {
      state.bookingQueue = (action.payload || []).map(mapRequestForClient);
    },

    addBooking: (state, action) => {
      const requestWithId = mapRequestForClient(action.payload);
      state.booking.push(requestWithId);
      if (requestWithId.status === "pending") {
        state.bookingQueue.push(requestWithId);
      }
    },

    deleteBooking: (state, action) => {
      state.booking = state.booking.filter(
        (item) =>
          item.requestId !== action.payload && item._id !== action.payload,
      );
      state.bookingQueue = state.bookingQueue.filter(
        (item) =>
          item.requestId !== action.payload && item._id !== action.payload,
      );
    },

    acceptRideRequest: (state, action) => {
      const requestId = action.payload;
      const bookingIdx = state.booking.findIndex(
        (request) =>
          request.requestId === requestId || request._id === requestId,
      );

      if (bookingIdx !== -1) {
        state.booking[bookingIdx].status = "accepted";
      }

      state.bookingQueue = state.bookingQueue.filter(
        (request) =>
          request.requestId !== requestId && request._id !== requestId,
      );
    },

    rejectRideRequest: (state, action) => {
      const requestId = action.payload;
      const bookingIdx = state.booking.findIndex(
        (request) =>
          request.requestId === requestId || request._id === requestId,
      );

      if (bookingIdx !== -1) {
        state.booking[bookingIdx].status = "rejected";
      }

      state.bookingQueue = state.bookingQueue.filter(
        (request) =>
          request.requestId !== requestId && request._id !== requestId,
      );
    },

    updateRequestInfo: (state, action) => {
      const updatedRequest = mapRequestForClient(action.payload);
      const requestIdx = state.booking.findIndex(
        (request) =>
          request.requestId === updatedRequest.requestId ||
          request._id === updatedRequest._id,
      );

      if (requestIdx !== -1) {
        state.booking[requestIdx] = {
          ...state.booking[requestIdx],
          ...updatedRequest,
        };
      }

      const queueIdx = state.bookingQueue.findIndex(
        (request) =>
          request.requestId === updatedRequest.requestId ||
          request._id === updatedRequest._id,
      );

      if (queueIdx !== -1) {
        state.bookingQueue[queueIdx] = {
          ...state.bookingQueue[queueIdx],
          ...updatedRequest,
        };
      }
    },
  },
});

export const createNewRequest = (requestData) => async (dispatch) => {
  const response = await fetch(REQUEST_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  dispatch(addBooking(data.newRequest));
  return data.message;
};

export const getAllRequests = () => async (dispatch) => {
  const response = await fetch(REQUEST_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  dispatch(setRequests(data.requests));
  return data.message || "Requests fetched successfully";
};

export const getBookingsByUser = (userId) => async (dispatch) => {
  const response = await fetch(`${BOOKINGS_URI}/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  dispatch(setBookings(data.bookings));
  return data.message || "Bookings fetched successfully";
};

export const getRequestQueueByUser = (userId) => async (dispatch) => {
  const response = await fetch(`${REQUEST_URI}/users/${userId}/queue`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  dispatch(setBookingQueus(data.requests));
  return data.message || "Request queue fetched successfully";
};

export const getRequestById = (requestId) => async (dispatch) => {
  const response = await fetch(`${REQUEST_URI}/${requestId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  dispatch(updateRequestInfo(data.request));
  return data.message || "Request fetched successfully";
};

export const updateRequest = (requestData) => async (dispatch) => {
  const { _id, ...rest } = requestData;
  const requestId = _id || requestData.requestId;

  const response = await fetch(`${REQUEST_URI}/${requestId}`, {
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

  dispatch(updateRequestInfo(data.request));
  return data.message;
};

export const deleteRequest = (requestId) => async (dispatch) => {
  const response = await fetch(`${REQUEST_URI}/${requestId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  dispatch(deleteBooking(requestId));
  return data.message;
};

export const {
  setRequests,
  setBookings,
  setBookingQueus,
  addBooking,
  deleteBooking,
  acceptRideRequest,
  rejectRideRequest,
  updateRequestInfo,
} = requestSlice.actions;

export default requestSlice.reducer;
