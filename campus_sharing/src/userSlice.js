import { createSlice } from "@reduxjs/toolkit";

const USER_URI = "http://localhost:5000/users";
const REGISTER_URI = `${USER_URI}/register`;
const LOGIN_URI = `${USER_URI}/login`;

const userSLice = createSlice({
  name: "User",
  initialState: [],
  reducers: {
    allUsers: (state, action) => {
      return action.payload;
    },
    addUser: (state, action) => {
      state.push(action.payload);
    },

    userDeleted: (state, action) => {
      return state.filter((user) => user._id !== action.payload);
    },

    userUpdated: (state, action) => {
      const userIndex = state.findIndex(
        (user) => user.id === action.payload?.id,
      );
      if (userIndex !== -1) {
        state[userIndex] = { ...state[userIndex], ...action.payload };
      }
    },

    updateStatus: (state, action) => {
      return state.map((item) =>
        item.email === action.payload.email
          ? { ...item, status: action.payload.status }
          : item,
      );
    },

    getUser: (state, action) => {
      return state.filter((user) => user.id === action.payload.id);
    },

    setLoggedInUser: (state, action) => {
      const user = action.payload;
      const existingUserIndex = state.findIndex(
        (item) => item._id === user._id,
      );

      if (existingUserIndex !== -1) {
        state[existingUserIndex] = {
          ...state[existingUserIndex],
          ...user,
        };
        return;
      }

      state.push(user);
    },
  },
});

export const createUser = (userInfo) => async (dispatch) => {
  const response = await fetch(REGISTER_URI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "User creation failed");
  }

  if (data?.user) {
    dispatch(addUser(data.user));
  }

  return data;
};

export const loginUser = (credentials) => async (dispatch) => {
  const response = await fetch(LOGIN_URI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  const authenticatedUser = data?.user || data;
  sessionStorage.setItem("user", JSON.stringify(authenticatedUser));
  dispatch(setLoggedInUser(authenticatedUser));

  return authenticatedUser;
};

export const deleteUser = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`${USER_URI}/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.json();
    if (!response.ok) {
      throw new Error(data?.message ?? "Unable to delete User");
    }

    dispatch(userDeleted(userId));
    return "User Deleted Successfully";
  } catch (error) {
    console.error(error);
  }
};

export const updateUser = (updatedInfo, userId) => async () => {
  try {
    const response = await fetch(`${USER_URI}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedInfo),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message ?? "Unable to update User");
    }
    return data?.user || updatedInfo;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllUsers = () => async (dispatch) => {
  try {
    const response = await fetch(USER_URI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Unable to fetch users");
    }

    dispatch(allUsers(data));
  } catch (error) {
    console.error(error);
  }
};

export const updateUserStatus = (userEmail, newStatus) => async (dispatch) => {
  try {
    const response = await fetch(`${USER_URI}/status/${userEmail}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Unable to update status");
    }

    dispatch(
      updateStatus({
        email: userEmail,
        status: data?.user?.status || newStatus,
      }),
    );
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

export const {
  userUpdated,
  userDeleted,
  addUser,
  updateStatus,
  setLoggedInUser,
  allUsers,
} = userSLice.actions;

export default userSLice.reducer;
