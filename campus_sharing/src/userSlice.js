import { createSlice } from "@reduxjs/toolkit";

const USER_URI = "http://localhost:5000/users";
const REGISTER_URI = `${USER_URI}/register`;
const LOGIN_URI = `${USER_URI}/login`;

const decodeJwtPayload = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};


const userSLice = createSlice({
  name: "User",
  initialState: { users: [], token: null },
  reducers: {
    allUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },

    userDeleted: (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },

    userUpdated: (state, action) => {
      const userIndex = state.users.findIndex(
        (user) => user.id === action.payload?.id,
      );
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...action.payload };
      }
    },

    updateStatus: (state, action) => {
      state.users = state.users.map((item) =>
        item.email === action.payload.email
          ? { ...item, status: action.payload.status }
          : item,
      );
    },

    getUser: (state, action) => {
      state.users.find((user) => user.id === action.payload.id);
    },

    setLoggedInUser: (state, action) => {
      state.token = action.payload;
    },

    clearLoggedInUser: (state) => {
      state.token = null;
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

  const token =
    data?.accessToken ;

  if (!token) {
    throw new Error("Login failed");
  }

  
  dispatch(setLoggedInUser(token));
  return token;
};


export const deleteUser = (userId) => async (dispatch, getState) => {
  try {
    const token = getState().user.token;
    const response = await fetch(`${USER_URI}/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message ?? "Unable to delete User");
    }

    dispatch(userDeleted(userId));
    return "User Deleted Successfully";
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = (updatedInfo, userId) => async (dispatch, getState) => {
  try {
    const token = getState().user.token;
    const response = await fetch(`${USER_URI}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updatedInfo),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message ?? "Unable to update User");
    }
    
    const updatedUser = data?.user || updatedInfo;
    dispatch(userUpdated(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllUsers = () => async (dispatch, getState) => {
  try {
    const token = getState().user.token;
    const response = await fetch(USER_URI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Unable to fetch users");
    }

    dispatch(allUsers(data));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUserStatus = (userEmail, newStatus) => async (dispatch, getState) => {
  try {
    const token = getState().user.token;
    const response = await fetch(`${USER_URI}/status/${userEmail}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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
    throw error;
  }
};

export const logoutUser = () => async (dispatch, getState) => {
  try {
    const token = getState().user.token;
    const response = await fetch(`${USER_URI}/logout`, {
      method:"POST", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Logout failed");
    }
    dispatch(clearLoggedInUser());
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export const {
  userUpdated,
  userDeleted,
  addUser,
  updateStatus,
  setLoggedInUser,
  allUsers,
  clearLoggedInUser,
} = userSLice.actions;

export const selectAuthToken = (state) => state.user.token;
export const selectCurrentUser = (state) => decodeJwtPayload(state.user.token);

export default userSLice.reducer;
