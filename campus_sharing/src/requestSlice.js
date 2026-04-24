import { createSlice } from "@reduxjs/toolkit";

const REQUEST_URI = "http://localhost:5000/requests";
const BOOKINGS_URI = "http://localhost:5000/bookings";

const requestSlice = createSlice({
  name: "request",
  initialState: {
    booking: [],
    bookingQueue: [],
  },
  reducers: {
    setRequests: (state, action) => {
      const requests = action.payload || [];
      state.booking = requests;
      state.bookingQueue = requests.filter(
        (request) => request.status === "pending",
      );
    },

    setBookings: (state, action) => {
      state.booking = action.payload;
    },

    setBookingQueus: (state, action) => {
      state.bookingQueue = action.payload;
    },

    addBooking: (state, action) => {
      const newRequest = action.payload;
      state.booking.push(newRequest);
      if (newRequest?.status === "pending") {
        state.bookingQueue.push(newRequest);
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
      const updatedRequest = action.payload;
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

    deleteByRideId: (state, action) => {
      const rideId = action.payload;
      state.booking = state.booking.filter(
        (item) =>
          String(item.ride_detail?._id || item.ride_detail || item.rideId) !==
          String(rideId),
      );
      state.bookingQueue = state.bookingQueue.filter(
        (item) =>
          String(item.ride_detail?._id || item.ride_detail || item.rideId) !==
          String(rideId),
      );
    },
  },
});

export const createNewRequest = (requestData) => async (dispatch, getState) => {
  const token = getState().user.token;
  const response = await fetch(REQUEST_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
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

export const getAllRequests = () => async (dispatch, getState) => {
  const token = getState().user.token;
  const response = await fetch(REQUEST_URI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  console.log("Fetched requests:", data.requests);
  dispatch(setRequests(data.requests));
  return data.message || "Requests fetched successfully";
};

export const getBookingsByUser = (userId) => async (dispatch, getState) => {
  const token = getState().user.token;
  const response = await fetch(`${BOOKINGS_URI}/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  dispatch(setBookings(data.bookings));
  return data.message || "Bookings fetched successfully";
};

export const getRequestQueueByUser = (userId) => async (dispatch, getState) => {
  const token = getState().user.token;
  const response = await fetch(`${REQUEST_URI}/users/${userId}/queue`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  dispatch(setBookingQueus(data.requests));
  return data.message || "Request queue fetched successfully";
};

export const getRequestById = (requestId) => async (dispatch, getState) => {
  const token = getState().user.token;
  const response = await fetch(`${REQUEST_URI}/${requestId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  dispatch(updateRequestInfo(data.request));
  return data.message || "Request fetched successfully";
};

export const updateRequest = (requestData) => async (dispatch, getState) => {
  const { _id, ...rest } = requestData;
  const requestId = _id || requestData.requestId;
  const token = getState().user.token;

  const response = await fetch(`${REQUEST_URI}/${requestId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
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

export const deleteRequestsByRideId = (rideId) => async (dispatch, getState) => {
  const token = getState().user.token;
  const response = await fetch(`${REQUEST_URI}/ride/${rideId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  dispatch(deleteByRideId(rideId));
  return data.message;
};

export const deleteRequest = (requestId) => async (dispatch, getState) => {
  const token = getState().user.token;
  const response = await fetch(`${REQUEST_URI}/${requestId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  dispatch(deleteBooking(requestId));
  return data.message;
};

export const deleteBookingsByRideId = (rideId) => async (dispatch, getState) => {
  const token = getState().user.token;
  const response = await fetch(`${BOOKINGS_URI}/ride/${rideId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  dispatch(deleteBooking(rideId));
  return data.message;
};

export const {
  setRequests,
  setBookings,
  setBookingQueus,
  addBooking,
  deleteBooking,
  deleteByRideId,
  acceptRideRequest,
  rejectRideRequest,
  updateRequestInfo,
} = requestSlice.actions;

export default requestSlice.reducer;
