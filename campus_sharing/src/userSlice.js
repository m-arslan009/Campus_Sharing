import { createSlice } from "@reduxjs/toolkit";

const userSLice = createSlice({
  name: "User",
  initialState: [
    {
      name: "Muhammad Arslan",
      email: "abc123@gmail.com",
      password: "abc123",
      username: "abc123",
      role: "Student",
      status: "Active",
    },
    {
      name: "Ali Hassan",
      email: "ali.hassan@gmail.com",
      password: "ali123",
      username: "alihassan",
      role: "Driver",
      status: "Active",
    },
    {
      name: "Sara Khan",
      email: "sara.khan@gmail.com",
      password: "sara123",
      username: "sarakhan",
      role: "Driver",
      status: "Active",
    },
    {
      name: "Zeeshan Rana",
      email: "zeeshan.rana@gmail.com",
      password: "zeeshan123",
      username: "zeeshanrana",
      role: "Student",
      status: "Inactive",
    },
  ],
  reducers: {
    addUser: (state, action) => {
      state.push(action.payload);
    },

    deleteUser: (state, action) => {
      return state.filter((user) => user.email !== action.payload);
    },

    updateUser: (state, action) => {
      const userIndex = state.findIndex(
        (user) => user.email === action.payload?.email,
      );
      if (userIndex !== -1) {
        state[userIndex] = { ...state[userIndex], ...action.payload };
      }
    },

    updateUserStatus: (state, action) => {
      return state.map((item) =>
        item.email === action.payload.key
          ? { ...item, status: action.payload.status }
          : item,
      );
    },

    getUser: (state, action) => {
      return state.filter((user) => user.email === action.payload);
    },
  },
});

export const { updateUser, deleteUser, addUser, updateUserStatus } =
  userSLice.actions;

export default userSLice.reducer;
